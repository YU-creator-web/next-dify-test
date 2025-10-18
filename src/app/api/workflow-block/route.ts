import { NextRequest, NextResponse } from 'next/server';

const endpoint =`${process.env.DIFY_API_URL}/workflows/run`
const DIFY_API_KEY = process.env.DIFY_API_WORKFLOW_KEY

export async function POST(request: NextRequest) {

    try {
        const body = await request.json()
        const { query } = body

        // DifyワークフローAPI接続
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${DIFY_API_KEY}`,
            },
            body: JSON.stringify({
                inputs: {
                    // 入力フィールドの変数名
                    query: query
                },
                response_mode: "blocking",
                user: "user-123"
            })
        })

        const data = await response.json()
        console.log(data)

        const outputText = data.data.outputs.result // 終了ブロックで設定

        return NextResponse.json(outputText)


    } catch (error) {
        console.error("APIエラー:", error)
        return NextResponse.json('Dify側でエラーが発生しました')
    }
        
    }
