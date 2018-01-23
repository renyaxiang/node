/*
 Navicat MySQL Data Transfer

 Source Server         : local
 Source Server Type    : MySQL
 Source Server Version : 50717
 Source Host           : localhost
 Source Database       : iME

 Target Server Type    : MySQL
 Target Server Version : 50717
 File Encoding         : utf-8

 Date: 01/23/2018 19:41:55 PM
*/

SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `users`
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `pid` varchar(36) NOT NULL,
  `username` varchar(60) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `mobile` varchar(11) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `nickname` varchar(60) DEFAULT NULL,
  `avatarUrl` varchar(100) DEFAULT NULL,
  `intro` text,
  `status` int(11) NOT NULL DEFAULT '1' COMMENT '0：禁用 1：普通用户 2：管理员',
  `githubId` text,
  `githubUserName` varchar(50) DEFAULT NULL,
  `githubAccessToken` text,
  `createDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updateDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`pid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Records of `users`
-- ----------------------------
BEGIN;
INSERT INTO `users` VALUES ('1b33a41c-f7a4-41b0-9899-8b42e242fbb1', 'xiangry', 'c4dc36f458bba545bcdea88ff0aa9e3a', null, '1399020825@@qq.com', 'xiangry', null, null, '2', null, null, null, '2017-10-29 09:12:25', '2017-10-29 09:12:25'), ('2be04211-1c8b-4be0-a34b-3a7ca006a5ed', 'test1', 'f192bc40b4cd2d99785763ece4df4f61', null, 'test@163.com', 'test1', null, null, '0', null, null, null, '2018-01-16 15:47:36', '2018-01-16 15:47:36'), ('446e24c3-e1fd-4a52-9b34-143088916b89', 'test', '944e7f5541dcc9e94aceb3a23d626af8', null, 'test@163.com', 'test', null, null, '1', null, null, null, '2018-01-16 15:46:09', '2018-01-16 15:46:09'), ('5766efa0-6b2c-48dc-8c91-ea23df296a35', 'xiang', '6a898486b892a340a06ef9c914ce9610', null, '134123@qq.com', 'xiang', null, null, '1', null, null, null, '2018-01-16 21:21:05', '2018-01-16 21:21:05'), ('5a58b4a2-d646-4494-8941-9b101a43bb97', 'renya', 'c4dc36f458bba545bcdea88ff0aa9e3a', null, '1399020825@@qq.com', 'renya', null, null, '2', null, null, null, '2017-10-24 14:27:56', '2017-10-24 14:27:56'), ('780df930-fab4-4e49-8329-127c4ab6f9db', 'test13', 'f192bc40b4cd2d99785763ece4df4f61', null, 'test@163.com', 'test13', null, null, '1', null, null, null, '2018-01-16 15:48:18', '2018-01-16 15:48:18'), ('a48b620f-ae58-463f-b4d9-861399bb7ad2', 'xiangry', 'c4dc36f458bba545bcdea88ff0aa9e3a', null, '1399020825@@qq.com', 'xiangry', null, null, '2', null, null, null, '2017-10-29 09:08:30', '2017-10-29 09:08:30'), ('bf4d827a-d067-4866-afcc-aee82a60ac27', 'renyaxiang', null, null, 'xiangrenya@gmail.com', 'renyaxiang', 'https://avatars1.githubusercontent.com/u/19942746?v=4', '好奇心是最好的老师', '2', '19942746', 'xiangrenya', '444a43b8a9f12280a0bba29df83ca16e69c35e9d', '2018-01-19 14:53:45', '2018-01-19 14:53:45'), ('f1d0ee8f-bf99-4e58-93d8-6e79a12ba8d8', 'admin', '4b78e581bdaffa037a6b11d58bdc934a', null, '1399020825@qq.com', 'admin', null, null, '2', null, null, null, '2018-01-18 09:06:49', '2018-01-18 09:06:49'), ('f7363653-92e1-498f-a281-b0439ce7b224', 'test', '944e7f5541dcc9e94aceb3a23d626af8', null, 'test@163.com', 'test', null, null, '1', null, null, null, '2018-01-16 15:44:50', '2018-01-16 15:44:50');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
