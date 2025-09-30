import { NextRequest, NextResponse } from 'next/server'
import { ProductService } from '../../../../services/productService'
import { CreateProductSchema } from '../../../../types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || undefined
    const status = searchParams.get('status') || undefined
    const categoryId = searchParams.get('categoryId') || undefined

    const result = await ProductService.getAll({
      page,
      limit,
      search,
      status,
      categoryId,
    })

    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    })
  } catch (error) {
    console.error('获取产品列表失败:', error)
    return NextResponse.json(
      { success: false, error: '获取产品列表失败' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = CreateProductSchema.parse(body)

    const product = await ProductService.create(validatedData)

    return NextResponse.json({
      success: true,
      data: product,
      message: '产品创建成功',
    })
  } catch (error) {
    console.error('创建产品失败:', error)
    
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { success: false, error: '产品slug或SKU已存在' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: '创建产品失败' },
      { status: 500 }
    )
  }
}