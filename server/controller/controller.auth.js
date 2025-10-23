require('dotenv').config()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const { groupModel: Group, userModel: User } = require('../db/db.schema.js')

const JWT_SECRET = process.env.SECRET_KEY
if (!JWT_SECRET) {
  console.error('Missing SECRET_KEY in env'); process.exit(1)
}

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d'
const COOKIE_MAX_AGE_MS = Number(process.env.COOKIE_MAX_AGE_MS) || 24 * 60 * 60 * 1000
const BCRYPT_SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 10

const createToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  })
}

const saveOnDb = async (username, pwd, Model, userId = null) => {
  if (!Model || !Model.modelName) throw new Error('Invalid Model')
  try {
    const salt = await bcrypt.genSalt(BCRYPT_SALT_ROUNDS)
    const hashedPwd = await bcrypt.hash(pwd, salt)

    const docData = {
      name: username,
      password: hashedPwd
    }

    if (Model.modelName === 'Group' && userId) {
      const normalizeToObjectIdArray = val => {
        if (Array.isArray(val)) {
          return val.map(v => mongoose.Types.ObjectId.isValid(v) ? mongoose.Types.ObjectId(v) : v)
        }
        return [ mongoose.Types.ObjectId.isValid(val) ? mongoose.Types.ObjectId(val) : val ]
      }

      const oids = normalizeToObjectIdArray(userId)
      docData.userIdAdmin = oids
      docData.userId = oids
    }

    const doc = new Model(docData)
    const saved = await doc.save()
    return saved
  } catch (err) {
    if (err && err.code === 11000) {
      throw Object.assign(new Error('duplicate_key'), { code: 11000, keyValue: err.keyValue })
    }
    throw err
  }
}


const userSignup = async (req, res) => {
  const { username, pwd } = req.body
  if (!username || !pwd) return res.status(400).json({ error: 'username and pwd are required' })

  try {
    const userDoc = await saveOnDb(username, pwd, User)
    const id = userDoc._id.toString()
    const tokenJwt = createToken(id)

    res.cookie('jwt', tokenJwt, {
      httpOnly: true,
      maxAge: COOKIE_MAX_AGE_MS,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    })
    return res.status(201).json({ user: id })
  } catch (err) {
    console.error('signup error:', err)
    if (err.code === 11000) return res.status(409).json({ error: 'username already exists' })
    return res.status(500).json({ error: err.message || 'internal server error' })
  }
}

const groupSignup = async (req, res) => {
  const { groupName, pwd } = req.body
  const tokenId = req.user?.id || req.user?.userId || req.user?.userid

  if (!groupName || !pwd) return res.status(400).json({ error: 'groupName and pwd are required' })
  if (!tokenId) return res.status(401).json({ error: 'No token provided' })
  if (!mongoose.Types.ObjectId.isValid(tokenId)) return res.status(400).json({ error: 'Invalid user id' })

  try {
    const user = await User.findById(tokenId)
    if (!user) return res.status(404).json({ error: 'User not found' })

    const group = await saveOnDb(groupName, pwd, Group, tokenId)

    await User.updateOne({ _id: tokenId }, { $addToSet: { groupIds: group._id } })

    return res.status(201).json({ group: group._id.toString() })
  } catch (err) {
    console.error('groupSignup error:', err)
    if (err.code === 11000) return res.status(409).json({ error: 'group name already exists' })
    return res.status(500).json({ error: err.message || 'internal server error' })
  }
}

const userSigIn = async (req, res) => {
  const { username, pwd } = req.body
  if (!username || !pwd) return res.status(400).json({ error: 'empty name or password' })

  try {
    const user = await User.findOne({ name: username }).select('+password').exec()
    if (!user) return res.status(400).json({ error: 'Invalid credentials' })

    const match = await bcrypt.compare(pwd, user.password)
    if (!match) return res.status(400).json({ error: 'Invalid credentials' })

    const tokenJwt = createToken(user._id.toString())
    res.cookie('jwt', tokenJwt, {
      httpOnly: true,
      maxAge: COOKIE_MAX_AGE_MS,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    })
    return res.status(200).json({ user: user._id.toString() })
  } catch (err) {
    console.error('signin error:', err)
    return res.status(500).json({ error: err.message || 'internal server error' })
  }
}

const groupSigIn = async (req, res) => {
  const { groupName, groupPwd } = req.body
  const userId = req.user?.id || req.user?.userId || req.user?.userid

  if (!groupName || !groupPwd) return res.status(400).json({ error: 'empty name or password' })
  if (!userId) return res.status(401).json({ error: 'Unauthorized' })
  if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).json({ error: 'Invalid user id' })

  try {
    const group = await Group.findOne({ name: groupName }).select('+password').exec()
    if (!group) return res.status(400).json({ error: 'Invalid credentials' })

    const match = await bcrypt.compare(groupPwd, group.password)
    if (!match) return res.status(400).json({ error: 'Invalid credentials' })

    await Promise.all([
      Group.updateOne({ _id: group._id }, { $addToSet: { userId: userId } }),
      User.updateOne({ _id: userId }, { $addToSet: { groupIds: group._id } })
    ])

    return res.status(200).json({ message: 'Login successful', groupId: group._id.toString() })
  } catch (err) {
    console.error('groupSigIn error:', err)
    return res.status(500).json({ error: err.message || 'internal server error' })
  }
}

module.exports = { userSignup, groupSignup, userSigIn, groupSigIn }
