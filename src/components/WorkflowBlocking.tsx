'use client'
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea} from "@/components/ui/textarea"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function WorkflowBlocking() {
    const [input, setInput] = useState("")
    const [output, setOutput] = useState("") 
    
    const callDifyApi = async () => {
        if(!input.trim()) return
        
        setOutput("")

        try {
            const response = await fetch("/api/workflow-block",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    query: input
                }),
            })

            const result = await response.json()
            setOutput(result)
            
            
        } catch (error) {
            console.error("API接続に失敗", error)
            setOutput("エラーが発生しました")
        }
    }
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Dify workflow API</CardTitle>
        <CardDescription>
          シンプルなワークフロー
        </CardDescription>
        <CardAction>
          <Button variant="link">Sign Up</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {/* 入力エリア */}
            <Textarea
                placeholder="質問を入力してください"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={4}
                className="w-full text-base md:text-base mb-8"
            />
        {/* 出力エリア */}
            { output && (
                <div className="p-4 bg-gray-100 rounded-md">
                    <h3 className="text-sm font-medium mb-2">回答:</h3>
                    <p className="whitespace-pre-wrap text-base md:text-base">{output}</p>
                </div>
            )}
    </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button onClick={callDifyApi} className="w-full">送信</Button>
      </CardFooter>
    </Card>
  )
}
