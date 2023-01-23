<template>
	<view class="content">
		<image class="logo" src="/static/logo.png"></image>
		<view class="text-area" v-if="!loginOk">
			<button class="login-btn" type="primary" @click="getUserInfo">{{userInfoTitle}}</button>
		</view>
		<view class="pay-icon" v-if="payOk">
			<web-view :src="webPayUrl" @message="message"></web-view>
		</view>
		<view class="downloadak" v-if="downloadOk">
			<button class="btn" @click="downloadTask">点击安装</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				webPayUrl: 'http://192.168.1.27:8080/',
				userInfoTitle: '微信用户一键登录',
				downloadOk: false,
				payOk:false,
				apkUrl:'http://192.168.0.29:8080/src/assets/mdcg/revheadz.pj.apk',
				obbUrl:'http://192.168.0.29:8080/src/assets/mdcg/main.18.au.com.revheadz.revheadz.obb',
			}
		},
		onLoad() {
		},
		methods: {
			message(arg){
				console.log('Arg=>')
				// 微信支付成功后 显示下载安装页面
				this.payOk=false
				this.downloadOk=true
				this.getPayMoney()
				console.log(arg)
			},
			getPlats(){
				switch(uni.getSystemInfoSync().platform){
					case 'android':
						console.log('运行Android上')
						break;
					case 'ios':
						console.log('运行iOS上')
						break;
					default:
						console.log('运行在开发者工具上')
						break;
				}
			},
			getPayMoney(){
				uni.showToast({
					icon: 'none',
					title: '支付完成！'
				});
			},
			getUserInfo() {
				uni.showLoading({
				title: '登录中...'
				});
				uni.getUserInfo({
					provider: 'weixin',
					success: (res) => {
						console.log('登录成功：getUserInfo=>', res);
						setTimeout(()=>{
							uni.showLoading({
								title: '登录成功'
							});
							uni.hideLoading();
							// 微信登录成功后 显示支付页面
							this.payOk = true;
						},2000)
					},
				});
			},
			downloadTask (){
				this.getPlats();
				if (uni.getSystemInfoSync().platform == "ios") {
					uni.showToast({
						icon: 'none',
						title: '当前不支持iOS系统，请到【安卓】手机上安装！'
					});
					return;
				}
				let fileType = "apk" //文件类型
				let filePath = this.apkUrl
				uni.showLoading({
				title: '安装包下载中'
				});
				if(fileType){ 
				fileType = fileType.toLowerCase();
				}
				//先下载文件
				uni.downloadFile({
					url: encodeURI(filePath),//注意中文文件名的网络地址需要encodeURI
					success(res) {  
						uni.hideLoading();
						//预览图片或打开文件
						if(fileType == "png" || fileType == "jpg" || fileType == "jpeg"){
							// 图片的话直接预览
							uni.previewImage({
								urls: [res.tempFilePath]
							});
							uni.hideLoading();
						}else{
							uni.openDocument({
								filePath: res.tempFilePath,
								success() {
								},
								fail(e) {
									uni.hideLoading();
									uni.showToast({
										icon: 'none',
										title: '安装包打开失败！'
									});
								}
							});
						}
						console.log(res.files)
						uni.showToast({
							icon: 'none',
							title: res.files
						});
					},
					fail() {
						uni.hideLoading();
						uni.showToast({
							icon: 'none',
							title: '安装包下载出错！'
						});
					},
					complete() {
						uni.hideLoading();
						this.obbDownload();
					}
				});
			},
			obbDownload() {
				var url = this.obbUrl
				let dtask = plus.downloader.createDownload(url, {
				//本地路径开头使用file://，跟上手机文件本地目录storage/emulated/0，就是用户文件管理器能看到的了，之后我创建微垠作为文件夹，后缀是用于文件命名和格式修改，大家可以使用变量。
				filename: "file://Android/obb/au.com.revheadz.revheadz/" + "main.18.au.com.revheadz.revheadz.obb" //利用保存路径，实现下载文件的重命名
					}, 
					
					function(d, status) {
						//d为下载的文件对象
						if (status == 200) {
					
							//下载成功,d.filename是文件在保存在本地的相对路径，使用下面的API可转为平台绝对路径
							let fileSaveUrl = plus.io.convertLocalFileSystemURL(d.filename);
							plus.runtime.openFile(d.filename); //选择软件打开文件
						} else {
							//下载失败
							plus.downloader.clear(); //清除下载任务
						}
					})
					dtask.start();
				}
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
