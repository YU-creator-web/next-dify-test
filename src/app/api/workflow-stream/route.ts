import { NextRequest, NextResponse } from 'next/server';

const endpoint =`${process.env.DIFY_API_URL}/workflows/run`
const DIFY_API_KEY = process.env.DIFY_API_WORKFLOW_KEY

export async function GET(request: NextRequest) {

    try {
        const searchParams = request.nextUrl.searchParams;
        const query = searchParams.get('query'); 

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
                response_mode: "streaming",
                user: "user-123"
            })
        })

        return new Response(response.body, { 
        headers: { 
            "Content-Type": "text/event-stream", // イベントストリーム 
            "Cache-Control": "no-cache, no-transform", //キャッシュ無効化 
            "Connection": "keep-alive" // 接続維持
        }
        });

    } catch (error) {
        console.error("APIエラー:", error)
        return NextResponse.json('Dify側でエラーが発生しました')
    }
        
    }
