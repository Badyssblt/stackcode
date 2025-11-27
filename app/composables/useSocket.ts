// composables/useSocketIO.ts
import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export const useSocket = () => {

    const { data } = useAuth()

  const connected = ref(false)

  const connect = () => {
    if (socket?.connected) return socket

    // Connexion au serveur Socket.IO séparé
    const socketUrl = process.env.NODE_ENV === 'production'
      ? 'https://votre-domaine.com' // Votre domaine en production
      : 'http://localhost:3000' // Port du serveur Socket.IO

    socket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      autoConnect: true
    })

    socket.on('connect', () => {
      connected.value = true
      console.log('✅ Connecté:', socket?.id)
    })

    socket.on('disconnect', () => {
      connected.value = false
      console.log('❌ Déconnecté')
    })

    return socket
  }

  const disconnect = () => {
    socket?.disconnect()
    socket = null
    connected.value = false
  }

  const emit = (event: string, data: any) => {
    socket?.emit(event, data)
  }

  const on = (event: string, callback: (...args: any[]) => void) => {
    socket?.on(event, callback)
  }

  const off = (event: string) => {
    socket?.off(event)
  }


  /**
   * S'abonner aux notifications de l'utilisateur
   */
  const subscribeUserNotifications = () => {
    const userId = data.value?.user.id
    if (!socket?.connected) {
      console.warn('⚠️ Socket non connecté, tentative de connexion...')
      connect()
      socket?.once('connect', () => {
        socket?.emit('subscribe:user', userId)
      })
    } else {
      socket.emit('subscribe:user', userId)
    }
  }

  return {
    socket,
    connected: readonly(connected),
    connect,
    disconnect,
    emit,
    on,
    off,
    subscribeUserNotifications
  }
}