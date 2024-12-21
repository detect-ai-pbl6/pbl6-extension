import { useState, useRef, useEffect } from "react"

export const useWebsocket = ({ url, token }) => {
    const [isReady, setIsReady] = useState(false)
    const [val, setVal] = useState()

    const ws = useRef(null)

    useEffect(() => {
        if (!token || typeof token !== 'string' || token.trim() === '') {
            console.error('Invalid token for WebSocket subprotocol');
            return;
        }
        
        const socket = new WebSocket(url, ["Token", token])

        socket.onopen = () => setIsReady(true)
        socket.onclose = () => setIsReady(false)
        socket.onmessage = (event) => setVal(event.data)

        ws.current = socket

        return () => {
            socket.close()
        }
    }, [url, token])

    return { ready: isReady, ws: ws.current, val, send: ws.current?.send.bind(ws.current) }
}
