import { Router } from 'express'
import sessions from '#core/sessions'

const router = Router()

router.post('/getAccess', (req, res) => {
  try {
    const { id }: { id: string } = req.body

    if (sessions.get(id)) 
      return res.status(400).json({ error: 'User already logged in' })

    const token = sessions.add(id)
    res.json({ token })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

export default router