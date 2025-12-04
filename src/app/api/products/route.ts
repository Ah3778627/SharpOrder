import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'products.json');

async function readDB() {
  try {
    const raw = await fs.readFile(DB_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return { products: [] };
  }
}

async function writeDB(obj: any) {
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
  await fs.writeFile(DB_PATH, JSON.stringify(obj, null, 2), 'utf8');
}

export async function GET(req: Request) {
  const db = await readDB();
  const url = new URL(req.url);
  const storeId = url.searchParams.get('storeId');
  const category = url.searchParams.get('category');
  const pageParam = parseInt(url.searchParams.get('page') || '1', 10);
  const limitParam = parseInt(url.searchParams.get('limit') || '12', 10);
  const sort = url.searchParams.get('sort');
  const search = url.searchParams.get('search');

  const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
  const limit = Number.isFinite(limitParam) && limitParam > 0 ? limitParam : 12;

  let list = Array.isArray(db.products) ? db.products.slice() : [];

  if (storeId) {
    list = list.filter((p: any) => p.storeId === storeId);
  }

  if (category) {
    const catLower = category.toLowerCase();
    list = list.filter((p: any) => (p.category || '').toLowerCase() === catLower);
  }

  // server-side search filtering
  if (search) {
    const searchLower = search.toLowerCase();
    list = list.filter((p: any) => {
      const name = (p.name || '').toLowerCase();
      const desc = (p.description || '').toLowerCase();
      return name.includes(searchLower) || desc.includes(searchLower);
    });
  }

  // server-side sorting
  if (sort) {
    switch (sort) {
      case 'price_asc':
        list.sort((a: any, b: any) => (Number(a.price) || 0) - (Number(b.price) || 0));
        break;
      case 'price_desc':
        list.sort((a: any, b: any) => (Number(b.price) || 0) - (Number(a.price) || 0));
        break;
      case 'name_asc':
        list.sort((a: any, b: any) => String((a.name || '')).localeCompare(String(b.name || '')));
        break;
      case 'name_desc':
        list.sort((a: any, b: any) => String((b.name || '')).localeCompare(String(a.name || '')));
        break;
      case 'newest':
        list.sort((a: any, b: any) => {
          const ta = a.createdAt ? new Date(a.createdAt).getTime() : (typeof a.id === 'string' && a.id.startsWith('prod_') ? parseInt(a.id.replace(/^prod_/, ''), 10) : 0);
          const tb = b.createdAt ? new Date(b.createdAt).getTime() : (typeof b.id === 'string' && b.id.startsWith('prod_') ? parseInt(b.id.replace(/^prod_/, ''), 10) : 0);
          return tb - ta;
        });
        break;
      default:
        break;
    }
  }

  const total = list.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  const paged = list.slice(start, start + limit);

  return NextResponse.json({ products: paged, total, page, limit, totalPages });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const product = body.product;
    if (!product || typeof product !== 'object' || !product.storeId) {
      return NextResponse.json({ error: 'Invalid product or missing storeId' }, { status: 400 });
    }

    const db = await readDB();
    const id = product.id || `prod_${Date.now()}`;
    const newProduct = { ...product, id };
    db.products = db.products || [];
    db.products.push(newProduct);
    await writeDB(db);

    return NextResponse.json(newProduct);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const product = body.product;
    if (!product || typeof product !== 'object' || !product.id || !product.storeId) {
      return NextResponse.json({ error: 'Invalid product or missing id/storeId' }, { status: 400 });
    }

    const db = await readDB();
    db.products = db.products || [];
    const idx = db.products.findIndex((p: any) => p.id === product.id && p.storeId === product.storeId);
    if (idx === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    db.products[idx] = { ...db.products[idx], ...product };
    await writeDB(db);

    return NextResponse.json(db.products[idx]);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    // allow id in query or body
    const url = new URL(req.url);
    const idFromQuery = url.searchParams.get('id');
    let id = idFromQuery;
    const storeId = url.searchParams.get('storeId');
    if (!id) {
      try {
        const body = await req.json();
        id = body?.id;
      } catch (e) {
        // ignore
      }
    }

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    const db = await readDB();
    db.products = db.products || [];
    const idx = db.products.findIndex((p: any) => p.id === id && (!storeId || p.storeId === storeId));
    if (idx === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const removed = db.products.splice(idx, 1)[0];
    await writeDB(db);

    return NextResponse.json({ success: true, removed });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed' }, { status: 500 });
  }
}
