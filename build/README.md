# 图标文件说明

Electron 打包需要以下图标文件：

## 所需图标文件

- **Windows**: `icon.ico` (256x256 或更大，包含多个尺寸)
- **macOS**: `icon.icns` (512x512 或更大，包含多个尺寸)
- **Linux**: `icon.png` (512x512 或更大)

## 图标准备方法

### 方法 1: 使用在线工具转换

1. 准备一个 512x512 或更大的 PNG 图标源文件
2. 使用以下工具转换：
   - **ICO**: https://convertio.co/zh/png-ico/ 或 https://www.icoconverter.com/
   - **ICNS**: https://cloudconvert.com/png-to-icns 或使用 macOS 的 `iconutil` 命令
   - **PNG**: 直接使用源文件

### 方法 2: 使用命令行工具

#### Windows ICO
```bash
# 使用 ImageMagick (需要先安装)
magick convert icon.png -define icon:auto-resize=256,128,64,48,32,16 icon.ico
```

#### macOS ICNS
```bash
# 在 macOS 上
mkdir icon.iconset
sips -z 16 16 icon.png --out icon.iconset/icon_16x16.png
sips -z 32 32 icon.png --out icon.iconset/icon_16x16@2x.png
sips -z 32 32 icon.png --out icon.iconset/icon_32x32.png
sips -z 64 64 icon.png --out icon.iconset/icon_32x32@2x.png
sips -z 128 128 icon.png --out icon.iconset/icon_128x128.png
sips -z 256 256 icon.png --out icon.iconset/icon_128x128@2x.png
sips -z 256 256 icon.png --out icon.iconset/icon_256x256.png
sips -z 512 512 icon.png --out icon.iconset/icon_256x256@2x.png
sips -z 512 512 icon.png --out icon.iconset/icon_512x512.png
sips -z 1024 1024 icon.png --out icon.iconset/icon_512x512@2x.png
iconutil -c icns icon.iconset
```

#### Linux PNG
```bash
# 直接使用 512x512 的 PNG 文件
cp icon.png build/icon.png
```

## 临时解决方案

如果没有准备图标文件，electron-builder 会使用默认图标。建议尽快准备自定义图标。

## 文件位置

将转换好的图标文件放在 `build/` 目录下：
- `build/icon.ico` (Windows)
- `build/icon.icns` (macOS)
- `build/icon.png` (Linux)

