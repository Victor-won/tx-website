import { NextRequest, NextResponse } from 'next/server'
import { MediaService } from '../../../../../services/mediaService'
import { UpdateMediaFileSchema } from '../../../../../types'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const mediaFile = await MediaService.getById(id)

    if (!mediaFile) {
      return NextResponse.json(
        { success: false, error: '媒体文件不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: mediaFile,
    })
  } catch (error) {
    console.error('获取媒体文件详情失败:', error)
    return NextResponse.json(
      { success: false, error: '获取媒体文件详情失败' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validatedData = UpdateMediaFileSchema.parse(body)

    const mediaFile = await MediaService.update(id, validatedData)

    return NextResponse.json({
      success: true,
      data: mediaFile,
      message: '媒体文件更新成功',
    })
  } catch (error) {
    console.error('更新媒体文件失败:', error)
    
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json(
        { success: false, error: '媒体文件不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { success: false, error: '更新媒体文件失败' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await MediaService.delete(id)

    return NextResponse.json({
      success: true,
      message: '媒体文件删除成功',
    })
  } catch (error) {
    console.error('删除媒体文件失败:', error)
    
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      return NextResponse.json(
        { success: false, error: '媒体文件不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { success: false, error: '删除媒体文件失败' },
      { status: 500 }
    )
  }
}