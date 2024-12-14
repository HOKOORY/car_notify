addEventListener('fetch', event => {
	event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
	const url = new URL(request.url);
	const host = url.host;
	const pathSegments = url.pathname.split('/').filter(segment => segment !== '')
	if (pathSegments[0] === null || pathSegments[0] === undefined) {
		const html = `
		<!DOCTYPE html>
		<html lang="zh-CN">
		
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>通知车主挪车</title>
			<script src="https://cdnjs.cloudflare.com/ajax/libs/lz-string/1.5.0/lz-string.min.js"></script>
			<!-- <script src="https://cdn.jsdelivr.net/npm/qrcodejs2@0.0.2/qrcode.min.js"></script> -->
			<script src="https://proxy.hokoory.top/https://unpkg.com/qrcodejs2@0.0.2/qrcode.min.js"></script>
			<style>
				body {
					font-family: Arial, sans-serif;
					max-width: 600px;
					margin: 0 auto;
					padding: 20px;
					text-align: center;
					background-color: #f4f4f4;
				}
		
				.container {
					background-color: white;
					border-radius: 8px;
					padding: 30px;
					box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
				}
		
				h1 {
					font-size: 24px;
					margin-bottom: 20px;
					color: #007bff;
				}
		
				p {
					margin-bottom: 20px;
					font-size: 16px;
					color: #555;
				}
		
				input {
					width: 100%;
					padding: 10px;
					margin: 10px 0;
					border: 1px solid #ddd;
					border-radius: 4px;
				}
		
				button {
					background-color: #4CAF50;
					color: white;
					border: none;
					padding: 10px 20px;
					border-radius: 4px;
					cursor: pointer;
					transition: background-color 0.3s;
				}
		
				button:hover {
					background-color: #45a049;
				}
		
				#qrcode-container {
					margin-top: 20px;
					display: flex;
					flex-direction: column;
					align-items: center;
				}
		
				#qrcode {
					margin-bottom: 10px;
				}
		
				.btn-container {
					display: none;
					justify-content: center;
					align-items: center;
					gap: 40px;
				}

				#toast-container {
					position: fixed;
					left: 50%;
					transform: translateX(-50%);
					z-index: 9999;
					max-width: 80%;
					padding: 10px 20px;
					border-radius: 5px;
					color: #fff;
					text-align: center;
					opacity: 0;
					transition: all 0.3s ease-in-out;
				}
		
				/* 不同类型的Toast样式 */
				.toast-success {
					background-color: rgba(76, 175, 80, 0.8);
				}
		
				.toast-error {
					background-color: rgba(244, 67, 54, 0.8);
				}
		
				.toast-warning {
					background-color: rgba(255, 152, 0, 0.8);
				}
		
				.toast-info {
					background-color: rgba(33, 150, 243, 0.8);
				}
		
				/* 不同位置的Toast */
				.toast-top {
					top: 20px;
				}
		
				.toast-bottom {
					bottom: 20px;
				}
		
				.toast-center {
					top: 50%;
					transform: translate(-50%, -50%);
				}
			</style>
		</head>
		
		<body>
			<div class="container">
				<h1>生成挪车二维码</h1>
				<p>请按照要求输入对应参数</p>
				<input type="text" id="phone" placeholder="联系电话(必填)">
				<input type="text" id="uid" placeholder="UID，不会填就空着">
				<button onclick="generateQRCode()">生成挪车二维码</button>
				<div id="qrcode-container">
            <div id="qrcode"></div>
			</div>
			<div class="btn-container" id="btn-container">
				<button id="saveButton" class="btn" onclick="saveQRCode()">保存图片</button>
				<button class="btn" onclick="copyText()">复制链接</button>
			</div>
				</div>
				<div id="toast-container"></div>
			<script>
			class Toast {
				constructor() {
					this.container = document.getElementById('toast-container');
				}
	
				// 显示Toast
				show(message, type = 'info', position = 'bottom', duration = 2000) {
					// 重置所有可能的类
					this.container.className = '';
	
					// 添加类型和位置样式
					this.container.classList.add("toast-"+type);
					this.container.classList.add("toast-"+position);
	
					// 设置消息
					this.container.textContent = message;
	
					// 显示Toast
					this.container.style.opacity = '1';
	
					// 定时隐藏
					setTimeout(() => {
						this.container.style.opacity = '0';
					}, duration);
				}
			}
			const toast = new Toast();
			function showToast(
				message,
				type = 'info',
				position = 'bottom',
				duration = 2000
			) {
				toast.show(message, type, position, duration);
			}
			let qrContent = "";
				function generateQRCode() {
					let phone = document.getElementById('phone').value;
					let uid = document.getElementById('uid').value;
					const host = "${host}";
					if (!phone) {
						alert('请填写联系电话');
						return;
					}
					phone = encodeURIComponent(LZString.compressToBase64(phone));
					if(uid){
						uid = encodeURIComponent(LZString.compressToBase64(uid));
					}
					// 清空之前的二维码
					document.getElementById('qrcode').innerHTML = '';
					qrContent = "http://"+host+"/notify?phone="+phone;
					// 生成二维码内容
					if(uid){
						qrContent = qrContent + "&uid="+uid;
					}
					
					// alert(qrContent);
					const qrcode = new QRCode("qrcode", {
						text: qrContent,
						width: 215,
						height: 215,
						colorDark: "#000000",
						colorLight: "#ffffff",
						correctLevel: QRCode.CorrectLevel.H
					});
					document.getElementById('btn-container').style.display = 'block';
				}

				
				function saveQRCode() {
					// 获取二维码的图像元素
					const qrcodeImg = document.querySelector('#qrcode img');
		
					if (!qrcodeImg) {
						alert('请先生成二维码');
						return;
					}
		
					// 创建一个临时画布来处理图片
					const canvas = document.createElement('canvas');
					const ctx = canvas.getContext('2d');
		
					// 设置画布大小与图片相同
					canvas.width = qrcodeImg.width;
					canvas.height = qrcodeImg.height;
		
					// 绘制图片到画布
					ctx.drawImage(qrcodeImg, 0, 0);
		
					// 将画布转换为 Blob
					canvas.toBlob(function (blob) {
						// 创建下载链接
						const link = document.createElement('a');
						link.download = "挪车二维码_"+new Date().getTime()+".png";
						link.href = URL.createObjectURL(blob);
		
						// 触发下载
						link.click();
		
						// 释放内存
						URL.revokeObjectURL(link.href);
					}, 'image/png');
				}
				
				function copyText() {
					if (navigator.clipboard && window.isSecureContext) {
						showToast('文本已复制');
						return navigator.clipboard.writeText(qrContent);
					}
					else {
						const textArea = document.createElement('textarea');
						textArea.value = qrContent;
						textArea.style.position = 'fixed';
						textArea.style.left = '-9999px';
						document.body.appendChild(textArea);
						textArea.select();
						try {
							document.execCommand('copy');
							showToast('文本已复制');
							return Promise.resolve();
						} catch (err) {
							return Promise.reject(err);
						} finally {
							document.body.removeChild(textArea);
						}
					}
				}
			</script>
		</body>
		
		</html>
		`
		return new Response(html, {
			headers: { 'Content-Type': 'text/html;charset=UTF-8' },
		})
	}

	if (pathSegments[0] === "notify") {
		const phone = decodeURIComponent(url.searchParams.get('phone')); // 车主的手机号
		const wxpusherAppToken = 'AT_knYqhoQiU5qXqP9SBeaYT9NuKiFnYaDu'; // Wxpusher APP Token
		const wxpusherUIDs = decodeURIComponent(url.searchParams.get('uid')); // 车主的UIDs  , 'UID_d0pycYubbK6d766GNDo5deknw4i4'
		const htmlContent = `
	<!DOCTYPE html>
	<html lang="zh-CN">
	
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>通知车主挪车</title>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/lz-string/1.5.0/lz-string.min.js"></script>
		<!-- <script src="https://cdn.jsdelivr.net/gh/yeild/jigsaw/dist/jigsaw.min.js"></script>-->
		<script src="https://gh.akass.cn/yeild/jigsaw/refs/heads/master/dist/jigsaw.min.js"></script>
		<style>
			* {
				box-sizing: border-box;
				margin: 0;
				padding: 0;
			}
	
			body {
				font-family: Arial, sans-serif;
				display: flex;
				align-items: center;
				justify-content: center;
				height: 100vh;
				background: #f0f2f5;
				color: #333;
			}
	
			.container {
				text-align: center;
				padding: 20px;
				width: 100%;
				max-width: 400px;
				border-radius: 8px;
				box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
				background: #fff;
			}
	
			h1 {
				font-size: 24px;
				margin-bottom: 20px;
				color: #007bff;
			}
	
			p {
				margin-bottom: 20px;
				font-size: 16px;
				color: #555;
			}
	
			button {
				width: 100%;
				padding: 15px;
				margin: 10px 0;
				font-size: 18px;
				font-weight: bold;
				color: #fff;
				border: none;
				border-radius: 6px;
				cursor: pointer;
				transition: background 0.3s;
			}
	
			.notify-btn {
				background: #28a745;
			}
	
			.notify-btn:hover {
				background: #218838;
			}
	
			.call-btn {
				background: #17a2b8;
			}
	
			.call-btn:hover {
				background: #138496;
			}
	
			dialog {
				border: 1px solid #ccc;
				box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
				padding: 20px;
				width: 400px;
				position: fixed;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
			}
	
			dialog::backdrop {
				background-color: rgba(0, 0, 0, 0.5);
			}
		</style>
	</head>
	
	<body>
	
		<div class="container">
			<h1>通知车主挪车</h1>
			<p>如需通知车主，请点击以下按钮</p>
			<button class="notify-btn" id="notify" onclick="notifyOwner()">通知车主挪车</button>
			<button class="call-btn" onclick="callOwner()">拨打车主电话</button>
		</div>
		<dialog id="dialog">
			<div id="jidiv"></div>
			<button id="closeDialog" class="notify-btn">Close</button>
		</dialog>
		<script>
			let notifyTime = 0;
			let phone = "${phone}";
			phone = LZString.decompressFromBase64(phone);
			let uids = "${wxpusherUIDs}";
			let isHasUID = true;
			if(uids == null || uids == undefined || uids == "" || uids == "null"){
				document.getElementById('notify').style.display = 'none';
				isHasUID = false;
			} else {
				uids = LZString.decompressFromBase64(uids);
				uids = [uids]
			}
			// 调用 Wxpusher API 来发送挪车通知
			function notifyOwner() {
				if(!isHasUID){
					alert("该车辆不支持该功能");
					return;
				}
				if(notifyTime >= 3){
					alert("发送过于频繁");
					return;
				}
				const dialog = document.getElementById('dialog');
				const jidiv = document.getElementById('jidiv');
				const newji = document.createElement('div');
				newji.id = 'ji';
				newji.innerHTML = "";
				jidiv.appendChild(newji);
				const closeDialogBtn = document.getElementById('closeDialog');
				const ji = document.getElementById('ji');
				closeDialogBtn.addEventListener('click', () => {
					ji.parentNode.removeChild(ji);
					dialog.close();
				});
				dialog.showModal();
				let j = jigsaw.init({
					el: ji,
					width: 310, // 可选, 默认310
					height: 155, // 可选, 默认155
					onSuccess: function () {
						// alert("验证成功");
						ji.parentNode.removeChild(ji);
						dialog.close();
						fetch("https://wxpusher.zjiecode.com/api/send/message", {
						  method: "POST",
						  headers: { "Content-Type": "application/json" },
						  body: JSON.stringify({
						    appToken: "${wxpusherAppToken}",
						    content: "您好，有人需要您挪车，请及时处理。",
						    contentType: 1,
						    uids: uids
						  })
						})
						.then(response => response.json())
						.then(data => {
						  if (data.code === 1000) {
							notifyTime++;
						    alert("通知已发送！");
						  } else {
						    alert("通知发送失败，请稍后重试。"+data.msg);
						  }
						})
						.catch(error => {
						  console.error("Error sending notification:", error);
						  alert("通知发送出错，请检查网络连接。");
						});
					},
					onFail: function () {
						this.reset();
						alert("验证失败");
					},
					onRefresh: function () {
						alert("刷新成功");
					}
				});
			}
			// 拨打车主电话
			function callOwner() {
				const dialog = document.getElementById('dialog');
				const jidiv = document.getElementById('jidiv');
				const newji = document.createElement('div');
				newji.id = 'ji';
				newji.innerHTML = "";
				jidiv.appendChild(newji);
				const closeDialogBtn = document.getElementById('closeDialog');
				const ji = document.getElementById('ji');
				closeDialogBtn.addEventListener('click', () => {
					ji.parentNode.removeChild(ji);
					dialog.close();
				});
				dialog.showModal();
				let j = jigsaw.init({
					el: ji,
					width: 310, // 可选, 默认310
					height: 155, // 可选, 默认155
					onSuccess: function () {
						// alert(phone);
						ji.parentNode.removeChild(ji);
						dialog.close();
						window.location.href = "tel:"+phone;
					},
					onFail: function () {
						this.reset();
						// alert("验证失败");
					},
					onRefresh: function () {
						// alert("刷新成功");
					}
				});
	
			}
		</script>
	</body>
	
	</html>
  `

		return new Response(htmlContent, {
			headers: { 'Content-Type': 'text/html;charset=UTF-8' },
		})
	}
}