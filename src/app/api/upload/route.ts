import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import * as XLSX from "xlsx";

// Use Node.js runtime for file system operations
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  // Kiểm tra nếu là mapping request
  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    const { mapping, fileName } = await req.json();
    // Đọc lại file đã upload từ /tmp
    const filePath = path.join("/tmp", fileName);
    const buffer = await fs.readFile(filePath);
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });
    // Lấy dữ liệu các trường đã mapping
    const data = json.map((row: any) => {
      const mapped: Record<string, any> = {};
      Object.entries(mapping).forEach(([key, col]) => {
        mapped[key] = row[col as string];
      });
      return mapped;
    });
    // Demo: tính toán chỉ số tài chính cơ bản
    const totalRevenue = data.reduce((sum, r) => sum + (parseFloat(r.revenue) || 0), 0);
    const totalCOGS = data.reduce((sum, r) => sum + (parseFloat(r.cogs) || 0), 0);
    const grossMargin = totalRevenue ? ((totalRevenue - totalCOGS) / totalRevenue) * 100 : 0;
    return NextResponse.json({
      metrics: {
        totalRevenue,
        totalCOGS,
        grossMargin: grossMargin.toFixed(2) + "%",
      },
      data: data.slice(0, 10),
    });
  }
  const formData = await req.formData();
  const file = formData.get("file");
  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  const uploadDir = "/tmp";
  const filePath = path.join(uploadDir, file.name);
  await fs.writeFile(filePath, buffer);
  let results = {};
  try {
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });
    results = { preview: json.slice(0, 5) };
  } catch (e) {
    return NextResponse.json({ error: "Không đọc được file Excel/CSV" }, { status: 400 });
  }
  return NextResponse.json({ message: "File uploaded and parsed", fileName: file.name, results });
}
