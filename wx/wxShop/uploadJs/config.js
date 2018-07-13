var fileHost="xxxx.aliyuncs.com(你的阿里云oss地址)"
var config = {
  //aliyun OSS config
  uploadImageUrl: 'https://financial-store.oss-cn-hangzhou.aliyuncs.com', //默认存在根目录，可根据需求改
  AccessKeySecret: 'N8vniLVduRqoyhBHBB5mV0IxOcV4O0',
  OSSAccessKeyId: 'su1E1Pom4ggljTWF', 
  timeout: 87600 //这个是上传文件时Policy的失效时间
};
module.exports = config