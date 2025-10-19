import { useState, useRef, useEffect } from 'react' 

interface EventSourceType { 
  event: string; 
  workflow_run_id: string; 
  task_id: string; 
  data: { 
    text?: string; 
    node_type?: string; 
    outputs?: { 
      result?: string; 
      [key: string]: unknown; }; 
    [key: string]: unknown; }; 
  [key: string]: unknown; }

export function useWorkflowStream(){ 
    const [input, setInput] = useState('') 
    const [output, setOutput] = useState('') 
    const eventSourceRef = useRef<EventSource | null>(null) // 再レンダリング防止 
    const completeTextRef = useRef('') // 再レンダリング防止 

    const callDifyApi = () => {
        if (!input.trim()) return

        setOutput("処理を開始しています...")
        completeTextRef.current = "" 

        // 既存の接続があれば閉じる 
        if (eventSourceRef.current){ 
            eventSourceRef.current.close()
        } 

        const url = `/api/workflow-stream?query=${input}&userId=user-123}` // ルートハンドラー 
        const eventSource = new EventSource(url) // インスタンス化
        eventSourceRef.current = eventSource 

        // チャンクが届くたびに発火する
        eventSource.onmessage = (event) => {
            try { 
                const eventData = JSON.parse(event.data)
                handleEventData(eventData) 
            } catch (error) {
                console.error('データ解析エラー:', error, event.data) // 受け取ったデータに問題がある場合にエラー 
            }
        } 


    }

    const handleEventData = (eventData: EventSourceType) => {
        console.log('イベント受信', eventData.event) 
        if(eventData.event === 'text_chunk'){
            appendText(eventData.data.text as string)
        }

        if(eventData.event === 'workflow_finished'){
            if (completeTextRef.current === "" ||
                completeTextRef.current === "処理を開始しています...") { 
                    appendText(eventData.data.outputs?.result as string) 
                }
            if (eventSourceRef.current) eventSourceRef.current.close();
        } 
    };
    

    const appendText = (text: string) => { 
        if (!text.trim()) return; 
        // 文章をoutputに設定 

        completeTextRef.current += text 
        setOutput(completeTextRef.current) 
    }

    useEffect(() => {
        return () => {
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
            } 
            }; 
    }, [])

    return { 
        input, setInput, output, callDifyApi 
    }
}