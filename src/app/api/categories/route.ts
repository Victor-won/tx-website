import { NextRequest, NextResponse } from 'next/server'
import { CategoryService } from '../../../../services/categoryService'
import { CreateCategorySchema } from '../../../../types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || undefined
    const parentId = searchParams.get('parentId') || undefined

    const result = await CategoryService.getAll({
      page,
      limit,
      search,
      parentId: parentId === 'null' ? null : parentId,
    })

    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    })
  } catch (error) {
    console.error('获取分类列表失败:', error)
    return NextResponse.json(
      { success: false, error: '获取分类列表失败' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = CreateCategorySchema.parse(body)

    const category = await CategoryService.create(validatedData)

    return NextResponse.json({
      success: true,
      data: category,
      message: '分类创建成功',
    })
  } catch (error) {
    console.error('创建分类失败:', error)
    
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { success: false, error: '分类slug已存在' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: '创建分类失败' },
      { status: 500 }
    )
  }
}