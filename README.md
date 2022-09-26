# Mondrian
<image src="https://user-images.githubusercontent.com/30457954/192201658-3efd0ef8-ea8d-46ae-a63b-0945ddebde4b.png" width='100%'/>



**-Throw  messages  like  a  straight  line-**<br/>
**Mondrian**은 친한 친구사이에 간단하게 용건을 전달해야하는 상황을 타겟팅한 메신저 서비스입니다. 메시지를 보낼 친구를 선택하고 버튼을 누르면 버튼에 미리 등록된 메시지가 친구에게 푸시메시지 형태로 전송됩니다. 자주 보내는 메시지를 미리 등록해두고 상황에 따라 즉시 푸시를 날릴 수 있습니다. **Mondrian**은 자주 연락하는 친구에게 자주 꺼내는 주제를 던질 때 가장 경제적인 선택지가 될 수 있습니다.
 
## 기술 스택
### Front-end
- react-native CLI
- typescript
- context API
- FCM

### Back-end
- firebase realtime database

## 구현 기능
- 전화번호 인증 로그인
- 연락처 기반 친구 관리 기능(요청, 수락/거절, 삭제)
	-친구 요청을 구독하여 새로운 친구 요청이 오면 화면에 실시간 반영
- ID 기반 친구 요청 기능
- push message Icon 및 문구 사전 편집 기능 (local storage)
	- title, body, icon 커스텀하여 최대 6개의 메시지 설정 가능
- push message 전송
	- 40초간 최대 10회 전송 제한
- Notification On/Off 기능
	- 스마트폰 설정의 해당 루트로 리다이렉트
- 이름 변경 기능
- 로그아웃 / 회원 탈퇴


## 결과물
### android
<a href="https://play.google.com/store/apps/details?id=com.fleeo.mondrian">Google Playstore</a>
![image](https://user-images.githubusercontent.com/30457954/192201630-8561f8f0-4e98-47c0-a923-8761e5144433.png)


### ios
<a href="https://apps.apple.com/kr/app/mondrian/id1602056196">Apple Appstore</a>
![image](https://user-images.githubusercontent.com/30457954/192201600-a7aa8b3c-c89e-4d5a-aa0a-aec325f91da5.png)


