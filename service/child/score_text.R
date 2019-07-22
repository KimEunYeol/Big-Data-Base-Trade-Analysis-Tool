library(base64enc)
library(plyr,warn.conflicts = FALSE)
library(twitteR,warn.conflicts = FALSE)
library(stringr)
attach(input[[1]])


consumer_key = 'PrTrED9HnWCMa4yJ2jFkKHSEt'
consumer_secret = 'CpqGlzDmlSOlsh27IUnnKuxAIuCcqVQ7HRFBroYSrCCd0tyjC4'
access_token = '887219511891382272-ofKPmtvokjmfFnOQudtqFFURWRd4qw5'
access_secret = 'wh39eUOAf7v7b1SEweGgq3M4MxW2YR2aU85pE0wNgjaBx' 

#트위터 API인증 
setup_twitter_oauth(consumer_key,consumer_secret,access_token,access_secret)



# 
# # 여가
# entertain1=c('pc방','오락','당구','볼링')
# entertain2=c('경마','경륜','성인오락','도박')
# entertain3=c('놀이','여가','취미','여행')
# entertain4=c('무도','유흥','가무','댄스')
# entertain5=c('스포츠','운동','에어로빅','센터')
# entertain6=c('연극','영화','극장','연기')
# entertain7=c('요가','단전','마사지','경락')
# entertain8=c('전시','관람','티켓','할인')
# 
# #교통,운송
# trans1=c('관광서비스','지역관광','특산물','표값')
# 
# #국가기관,단체
# group1=c('운수','통신행정','운전','행사')
# 
# #금융
# bank1=c('금융관련단체기관','환율','카카오뱅크','케이뱅크')
# bank2=c('기타금융','이율','이자','펀드')
# bank3=c('보험','은행','제2금융','토스')
# 
# 
# 
# #기술,건축,환경
# tech1=c('건설업','노가다','중장비','측량')
# 
# tech2=c('건축','엔지니어링','기술서비스','캐드')
# tech3=c('건축설비','설치공사','설치비용','인건비')
# 
# #도매,유통,무역
# 
# dome1=c('가공식품','도매','완식품','냉동')
# 
# dome2=c('가전제품','도매','휴대기기','전자제품')
# dome3=c('건축자재','조매','중장비','현장')
# dome4=c('기계장비','중장비','지게차','도매')
# dome5=c('유통','영업','배송','품질')
# 
# dome6=c('무역업','운송','화물차','노조')
# dome7=c('상품중개','도매','홈쇼핑','품질')
# dome8=c('의류','시세','동대문','도매')
# dome9=c('장식재','꾸미기','장신구','도매')
# dome10=c('서적','음반','문구','도매')
# dome11=c('의약','의료품','약국','도매')
# dome12=c('주류','기호품','도매','비상약')
# dome13=c('청과물','제철과일','과일','도매')
# dome14=c('화장품','비누','세정제','락스')
# dome15=c('화초','식물','씨앗','도매')
# dome16=c('도료','비료','도매','단가')
# 
# 
# #부동산
# budong1=c('부동산서비스','부동산정책','공인중개사','부동산어플')
# budong2=c('부동산임대','임대시세','집값','부동산정책')
# budong3=c('부동산중개인','땅값','중개자격증','부동산')
# budong4=c('분양','대출','아파트가격','재개발')
# budong5=c('평가','개발','관리','부동산')
# 
# 
# #생활서비스
# service1=c('개인','가전제품수리','A/S','출장수리')
# service2=c('개인서비스','컴퓨터','자영업','수리')
# service3=c('광고','인쇄','현수막','포스터')
# service4=c('기타서비스업','소분류','중소기업','상권')
# service5=c('대중목용탕','휴게실','스터디룸','사우나')
# service6=c('대행업','용역','깡패','제3금융')
# service7=c('물품기기대여','시간당수당','대리비','대여값')
# service8=c('법무세무회계','변호사','변리사','공인중개사')
# service9=c('사진','스튜디오','인화','면접사진')
# service10=c('세탁','가사서비스','세탁실','신발빨래방')
# service11=c('예식','의례','관혼상제','결혼')
# service12=c('운송','배달','택배','운반')
# service13=c('미용','건강','피부관리','헤어샵')
# service14=c('인력','고용','용역알선','노가다')
# service15=c('자동차','이륜차','카센터','자동차수리')
# service16=c('장례','묘지','장례식장','공동묘지')
# service17=c('주유소','충전소','셀프주유소','기름값')
# service18=c('주택관리','클린주택','청소아줌마','임금')
# service19=c('행사','이벤트','몰래카메라','깜짝이벤트')
# 
# #소매
# 
# some1=c('가구','소매','쇼파','침대')
# some2=c('가방','신발','액세서리','소매')
# some3=c('가전제품','휴대기기','가전기기','소매')
# some4=c('가정','주방','인테리어','부엌')
# some5=c('건강','미용식품','건강식품','비타민')
# some6=c('기타판매업','소매가','도매','소매')
# some7=c('사무','문구','컴퓨터','노트북')
# some8=c('사진','광학','정밀기기','소매')
# some9=c('선물','팬시','기념품','소매')
# some10=c('시계','귀금속','목걸이','귀걸이')
# some11=c('애완','애견','동물','강이지')
# some12=c('예술품','골동품','수석','분재')
# some13=c('운동','경기용품','스포츠용품','소매')
# some14=c('유아용품','소매','인형','장난감')
# some15=c('음료품','식료품','소매','건강식품')
# some16=c('의복의류','예복','양복','한복')
# some17=c('의약','의료품','약국','소매')
# some18=c('자동차','자동차용품','샤시','소매')
# some19=c('종교용품판매','가톨릭교용품','기독교용품','불교용품')
# some20=c('종합소매점','도매가','도매','소매')
# some21=c('중고품','교환','중고나라','소매')
# some22=c('책','서적','도서','도서')
# some23=c('철물','난방','건설자재','냉방')
# some24=c('취미','오락','게임용품','장난감')
# some25=c('화장품','로션','스킨','소매')
# some26=c('페인트','유리제품','락커','소매')
# 
# 
# #스포츠
# sport1=c('실내운동시설','검도','태권도','헬스장')
# sport2=c('운영관리실','유도','테니스','골프')
# #언론 미디어
# media1=c('광고','신문','미디어','언론')
# #음식
# food1=c('기타음식','요기거리','기타먹을것','기타요리')
# food2=c('닭','오리요리','치킨','치맥')
# food3=c('별식','퓨전요리','이탈리아음식','한식대첩')
# food4=c('뷔페','무한뷔페','고급뷔페','초밥뷔페')
# food5=c('분식','떡볶이','오뎅','순대')
# food6=c('양식','스테이크','아웃백','빕스')
# food7=c('유흥주점','가요방','소주방','노래방')
# food8=c('음식배달서비스','요기요','배달통','퀵배달')
# food9=c('일식','수산물','회','초밥')
# food10=c('제과떡케익','제빵','뚜레쥬르','파르바게트')
# food11=c('중식','짬뽕','짜장면','탕수육')
# food12=c('커피점','카페','엔젤리너스','스타벅스')
# food13=c('패스트푸드','햄버거','피자','감자튀김')
# food14=c('한식','수정과','정식','갈비탕')
# 
# #의료
# 
# hospi1=c('병원','개인병원','종합병원','치과')
# hospi2=c('비수용복지시설','요양원','치매','알츠하이머')
# hospi3=c('수의업','애완견','애견','수의사')
# hospi4=c('약국','한약방','한의사','약사')
# hospi5=c('유사의료업','비슷한의료업','개인병원','종합병원')
# hospi6=c('의료관련서비스업','의료서비스','의료보험','수술비')
# #전기/가스/수도
# 
# elec1=c('전기','도체','반도체','전자')
# #전자,정보통신
# soft1=c('소프트웨어','데이터베이스','운영체제','윈도우')
# soft2=c('인터넷','프로토콜','이더넷','네이버')
# soft3=c('정보기술서비스','기술서비스','정보서비스','정보통신')
# soft4=c('통신','kt','sk','유플러스')
# #제조
# manifac1=c('가방','가죽제품','제조','모자')
# manifac2=c('건설','선축자재','제조','건축')
# manifac3=c('기계','장비','기구','기자재')
# manifac4=c('모피','악어가죽','너구리가죽','제조')
# manifac5=c('문구','잡화','제조','문구사')
# manifac6=c('식품가공','식품','식품군','식품영양')
# manifac7=c('의복','예복','제조','양복')
# manifac8=c('화합물','화학제품','위험물질','제조')
# #학문/교육
# educa1=c('도서관','독서실','일인독서실','독서실비용')
# educa2=c('연구소','연구원','랩실','연봉')
# educa3=c('유아교육','유교과','교직이수','어린이집')
# educa4=c('학교','학생','고등학교','중학교')
# educa5=c('한문','한자','중국어','입시')
# educa6=c('학원','보습','교습','입시')
# educa7=c('학원','어학','수리','언어')
# educa8=c('학원','예능','취미','체육')
# educa9=c('학원','음악','미술','무용')
# educa10=c('학원','자격증','국가고시','입용고시')
# educa11=c('학원','창업','취미','취업')
# educa12=c('학원','컴퓨터','소프트웨어','알고리즘')
# 
# 
# 
# #case1: 모든 직업군을 하나의 배열에 넣어서 루프돌리기
# #장,단점 : 코드길이는 짧아지나 오래걸리는시간
# job_list=rbind(entertain1,entertain2,entertain3,entertain4,entertain5,entertain6,entertain7,entertain8
#                 ,educa1,educa2,educa3,educa4,educa5,educa6,educa7,educa8,educa9,educa10,educa11,educa12
#                 ,manifac1,manifac2,manifac3,manifac4,manifac5,manifac6,manifac7,manifac8
#                 ,soft1,soft2,soft3,soft4
#                 ,elec1
#                 ,hospi1,hospi2,hospi3,hospi4,hospi5,hospi6
#                 ,food1,food2,food3,food4,food5,food6,food7,food8,food9,food10,food11,food12,food13,food14
#                 ,media1
#                 ,sport1,sport2
#         
#                 ,some1,some2,some3,some4,some5,some6,some7,some8,some9,some10,some11,some12,some13,some14,some15
#                 ,some16,some17,some18,some19,some20,some21,some22,some23,some24,some25,some26
#                 ,service1,service2,service3,service4,service5,service6,service7,service8,service9
#                 ,service10,service11,service12,service13,service14,service15,service16,service17,service18,service19
#                 ,budong1,budong2,budong3,budong4,budong5
#                 ,dome1,dome2,dome3,dome4,dome5,dome6,dome7,dome8,dome9,dome10,dome11,dome12,dome13,dome14
#                 ,dome15,dome16
#                 ,tech1,tech2,tech3
#                 ,bank1,bank2,bank3
#                 ,group1,trans1)

# job_list1=c(job_list)


#현재 날짜로 부터 일주일 전
date=as.Date(-7,origin = Sys.Date()) # 현재 날짜로 부터 일주일 전
date1=as.character(date)
                                # 형변환

#감정사전 불러오기
pos.word=read.table('/root/hanium/service/child/positive.txt')
neg.word=read.table('/root/hanium/service/child/negative.txt')

#pos.word=read.table('positive-ko.txt')
#neg.word=read.table('negative-ko.txt')

pos.word = pos.word$V1
neg.word = neg.word$V1
score.sentiment=function(sentences, pos.words, neg.words, .progress='none'){
   score=laply(sentences, function(sentence,pos.words,neg.words) {
     #문장에서 불필요한 요소 삭제
     sentence=gsub('[[:punct:]]','',sentence)
     sentence=gsub('[[:cntrl:]]','',sentence)
     sentence=gsub('\\d+','',sentence)
     sentence = str_replace_all(sentence,"[^[:graph:]]", " ") 
     #영어 모두 소문자로 
     sentence=tolower(sentence)
     #문장을 단어로 분리
     word.list=str_split(sentence,'\\s+')
     #분리된 단어들을 리스트에서 벡터로 변경
     words=unlist(word.list)
     #감정사전과 단어 비교
     pos.matches=match(words, pos.words)
     neg.matches=match(words, neg.words)
     #결측값 제거
     pos.matches=!is.na(pos.matches)
     neg.matches=!is.na(neg.matches)
     #긍정빈도-부정빈도=점수
     score=sum(pos.matches)-sum(neg.matches)
     return(score)
   }, pos.words, neg.words, .progress=.progress)
   score.df=data.frame(scores=score, text=sentences)
   return(score.df)
 }
# 
# 
# #감정사전 불러오기
# pos.word=scan("./positive-ko.txt", what="character", comment.char = ";")
# neg.word=scan("./negative-ko.txt", what="character", comment.char = ";")
# 

# 
# category = c("헬스장","지방","살","운동","다이어트")
job_lists=c()#선언
search_count=c()
rred = c()
#lat = 35.874
#lng = 128.246
geo = paste(lat,",",lng,",10km",sep="")
for(i in 1:length(category)){
   
   x=enc2utf8(category[i])
  # x_search=searchTwitter(x,since=date1,geocode=paste(lat,",",lng,",10km",sep=""),n=30)
   x_search=searchTwitter(x,since=date1,geocode=geo,n=50)
  # x_search=searchTwitter(x,since=date1,geocode="35.874,128.246,10km",n=10)
   name =category[i]
   count = length(x_search)
   job_lists[i]=name
   search_count[i]=count
   list(x_search)
   red_text<-laply(x_search, function(t)t$getText())
   rred = append(rred,red_text)
   rred<-rred[Encoding(rred)=='UTF-8']
   
   rred<-gsub('\\x','',rred) #특수문자제거
   
   
 
 }
# # 
# # 
red_score<-score.sentiment(rred, pos.word, neg.word, .progress='none')
# # 
# # # red_score$color[red_score$scores >=1] = "blue"
# # # red_score$color[red_score$score ==0] = "green"
# # # red_score$color[red_score$score < 0] = "red"
# # # 
# # # windows()
# # # 
# # # 
#  # ##############감성분석 빈도수#############################
#  # table(red_score$color)
#  
#  #칼럼 리코딩
red_score$remark[red_score$score >=1] = '긍정'
red_score$remark[red_score$score ==0] = '중립'
red_score$remark[red_score$score < 0] = '부정'
 
sentiment_result= table(red_score$remark)
frame = data.frame(sentiment_result)
colnames(frame)=c("감정","빈도")
return(frame)
