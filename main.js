var canvas = document.getElementById('canvas')
var context = canvas.getContext('2d')
var strokeStyle = null
autoSetCanvasSize(canvas)
listenToUser()
creatColorList()

// 创建颜色
function creatColorList() {
  var colorsList =
    [
      { name: 'black', hex: '#2f3640' },
      { name: 'red', hex: '#e84118' },
      { name: 'green', hex: '#4cd137' },
      { name: 'blue', hex: '#0097e6' }
    ]
  var ol = document.createElement('ol');
  ol.className = 'colors'
  for (index in colorsList) {
    let li = document.createElement('li');

    li.style.backgroundColor = colorsList[index].hex;
    li.id = colorsList[index].name
    li.className = 'color'
    if (index === '0') {
      li.classList.add('active')
      strokeStyle = colorsList[index].hex;
    }
    li.onclick = function (e) {
      var childs = e.target.parentElement.childNodes;
      for (var i = 0; i < childs.length; i++) {
        childs[i].classList.remove('active')
      }
      strokeStyle = e.target.style.backgroundColor;
      e.target.classList.add('active')

    }
    ol.append(li)
  }
  document.body.append(ol)
}
function drawCircle(x, y, radius) {
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2);
  context.fill();
  context.closePath()
}
/**
 * 画线
 * @param {number} x1 起始坐标x
 * @param {number} y1 起始坐标y
 * @param {number} x2 终点坐标x
 * @param {number} y2 终点坐标y
 */
function drawLine(x1, y1, x2, y2) {
  context.beginPath()
  context.moveTo(x1, y1);
  context.lineTo(x2, y2)
  context.stroke()
  context.closePath()
}

//橡皮擦
var eraserEnabled = false
eraser.onclick = function () {
  eraserEnabled = true
  eraser.classList.add('active');
  brush.classList.remove('active');
}
brush.onclick = function () {
  eraserEnabled = false
  brush.classList.add('active');
  eraser.classList.remove('active');
}

/**
 * 设置canvas尺寸等于窗口尺寸
 * @param {object} canvas //canvas对象
 */
function autoSetCanvasSize(canvas) {
  setCanvasSize()
  window.onresize = function () {
    setCanvasSize()
  }
  function setCanvasSize() {
    var pageWidth = document.documentElement.clientWidth;
    var pageHeight = document.documentElement.clientHeight;
    canvas.width = pageWidth;
    canvas.height = pageHeight;
    context.fillStyle = 'white'
    context.fillRect(0, 0, canvas.width, canvas.height)
  }
}

/**
 * 监听鼠标事件
 */
function listenToUser() {
  var using = false
  var lastPoint = { x: undefined, y: undefined }
  if (document.body.ontouchstart !== undefined) {
    //触屏设备
    canvas.ontouchstart = function (event) {
      var x = event.touches[0].clientX
      var y = event.touches[0].clientY
      using = true
      if (eraserEnabled) {
        context.fillStyle = 'white'
        drawCircle(x, y, 20)
      } else {
        context.fillStyle = strokeStyle
        drawCircle(x, y, 2.5)
      }
      lastPoint = { x, y }
    }
    canvas.ontouchmove = function () {
      var x = event.touches[0].clientX
      var y = event.touches[0].clientY
      var newPoint = { x, y }
      if (!using) { return }
      if (eraserEnabled) {
        context.lineWidth = 40
        context.strokeStyle = 'white';
        context.fillStyle = 'white';
        drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y)
        drawCircle(x, y, 20)
      } else {
        context.lineWidth = 5
        context.strokeStyle = strokeStyle;
        context.fillStyle = strokeStyle;
        drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y)
        drawCircle(x, y, 2)
      }
      lastPoint = newPoint
    }
    canvas.ontouchend = function () {
      using = false
    }
  } else {
    //非触屏设备
    canvas.onmousedown = function (event) {
      var x = event.clientX
      var y = event.clientY
      using = true
      if (eraserEnabled) {
        context.fillStyle = 'white'
        drawCircle(x, y, 20)
      } else {
        context.fillStyle = strokeStyle
        drawCircle(x, y, 2.5)
      }
      lastPoint = { x, y }
    }
    canvas.onmousemove = function (event) {
      var x = event.clientX
      var y = event.clientY
      var newPoint = { x, y }
      if (!using) { return }
      if (eraserEnabled) {
        context.lineWidth = 40
        context.strokeStyle = 'white';
        context.fillStyle = 'white';
        drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y)
        drawCircle(x, y, 20)
      } else {
        context.lineWidth = 5
        context.strokeStyle = strokeStyle;
        context.fillStyle = strokeStyle;
        drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y)
        drawCircle(x, y, 2.5)
      }
      lastPoint = newPoint
    }
    canvas.onmouseup = function (event) {
      using = false
    }
    canvas.onmouseout = function (evnet) {
      using = false
    }
  }
}

/**
 * 清屏
 */
trash.onclick = function () {
  context.fillStyle = 'white'
  context.fillRect(0, 0, canvas.width, canvas.height)
}

/**
 * 保存作品为PNG
 */
download.onclick = function () {
  let url = canvas.toDataURL('image/png')
  let a = document.createElement('a');
  a.href = url
  a.download = 'my-painting'
  a.target = '_blank'
  a.click()
}
