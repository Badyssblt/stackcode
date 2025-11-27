// server/plugins/socket.io.ts
import { Server } from 'socket.io'

let io: Server | null = null

export default defineNitroPlugin((nitroApp) => {
  console.log('🔧 Plugin Socket.IO chargé')

  // Utiliser le hook 'request' qui se déclenche au premier appel
  nitroApp.hooks.hook('request', (event) => {
    if (io) return // Déjà initialisé

    const node = event.node
    if (!node.req.socket?.server) return

    console.log('🎯 Serveur HTTP détecté, initialisation de Socket.IO...')

    io = new Server(node.req.socket.server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      },
      path: '/socket.io/',
      transports: ['websocket', 'polling']
    })

    io.on('connection', (socket) => {
    console.log('✅ Client connecté:', socket.id)

    // L'utilisateur peut s'abonner à ses propres notifications
    socket.on('subscribe:user', (userId: string) => {
      socket.join(`user:${userId}`)
      console.log(`👤 User ${userId} abonné aux notifications`)
    })

    // L'utilisateur peut s'abonner aux notifications d'un projet
    socket.on('subscribe:project', (projectId: string) => {
      socket.join(`project:${projectId}`)
      console.log(`📁 User ${socket.id} abonné au projet ${projectId}`)
    })

    socket.on('unsubscribe:user', (userId: string) => {
      socket.leave(`user:${userId}`)
    })

    socket.on('unsubscribe:project', (projectId: string) => {
      socket.leave(`project:${projectId}`)
    })

    socket.on('disconnect', () => {
      console.log('❌ Déconnecté:', socket.id)
    })
  })

    console.log('✅ Socket.IO initialisé et prêt')
  })
})

export const getSocketIO = () => io
