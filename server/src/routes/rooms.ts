import { Router } from 'express'
import { rooms } from '#core/store'

const router = Router()

router.get('/', (req, res) => {
  try {
    const roomInfo = Object.values(rooms).map(r => ({
      id: r.getId(),
      type: r.getType(),
      name: r.getName(),
      usersCount: r.getUsers().length
    }))
    res.json(roomInfo)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

export default router