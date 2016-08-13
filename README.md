# Teaming API Server

Teaming is Collaboration Tools that be promoted efficient works.
(now ver.1 is produced the APIs for web server. But it will be upgraded also for mobile service soon)

## Teaming
Teaming departed the three parts.
First one is for team. team have sections, each sections progress and team members.
The second is for section. section is main board to management works. It is also shown the progress of integrated works. They have section members who have authority of generate a work.
Finally third is for work. work is displayed state of themselves. Each state's means is 'To do', 'Doing', 'Done'.

## API Table

| NAME				| 메소드		| URL							| 설명					|
| :---------------- | :------------ | :---------------------------- | :-------------------- |
| 내정보				| GET			| /users						| 						|
| SNS 로그인(정보 수정)| POST			| /users/oauth					|						|
| SNS 로그아웃		| DELETE		| /users/oauth					|						|
| 사용자 정보			| GET			| /users/{user_id}				|						|
| 사용자 정보 변경		| PUT			|||
| 팀 생성			| POST			|||
| 팀 정보 변경		| PUT			|||
| 팀 삭제			| DELETE		|||
| 팀 목록			| GET			|||
| 팀 상세			| GET			|||
| 팀 초대URL 생성		| GET			|||
| 팀 탈퇴			| DELETE		|||
| ~~팀 초대코드 생성~~ | POST			|||
| 팀 가입 신청		| POST			|||
| ~~팀언 목록~~		| GET			|||
| 팀 가입 신청 목록	| GET			|||
| 팀 가입 신청 승인	| POST			|||
| 팀 가입 신청 승인 목록 | GET			|||
| 섹션 생성			| POST			|||
| 섹션 삭제			| DELETE		|||
| 섹션 참여			| POST			|||
| 섹션 수정			| PUT			|||
| 섹션 탈퇴			| DELETE		|||
| 섹션 참여자			| GET			|||
| 섹션 목록			| GET			|||
| 섹션 상세			| GET			|||
| 할일 생성			| POST			|||
| 할일 상세			| GET			|||
| 할일 변경			| PUT			|||
| 할일 삭제			| DELETE		|||
| 할일 참여			| POST			|||
| 할일 탈퇴			| DELETE		|||
| 할일 목록			| GET			|||
| 댓글 달기			| POST			|||
| 댓글 삭제			| DELETE		|||