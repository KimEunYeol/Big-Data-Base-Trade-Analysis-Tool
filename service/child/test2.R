library(KoNLP,warn.conflicts = FALSE)
library(rJava,warn.conflicts = FALSE)
#library(RMongo,warn.conflicts = FALSE)# Library 로드
library(twitteR,warn.conflicts = FALSE)
#library(wordcloud)
library(base64enc)
library(plyr,warn.conflicts = FALSE)
library(stringr,warn.conflicts = FALSE)
library(jsonlite)
attach(input[[1]])


consumer_key = 'PrTrED9HnWCMa4yJ2jFkKHSEt'
consumer_secret = 'CpqGlzDmlSOlsh27IUnnKuxAIuCcqVQ7HRFBroYSrCCd0tyjC4'
access_token = '887219511891382272-ofKPmtvokjmfFnOQudtqFFURWRd4qw5'
access_secret = 'wh39eUOAf7v7b1SEweGgq3M4MxW2YR2aU85pE0wNgjaBx' 

#트위터 API인증 
setup_twitter_oauth(consumer_key,consumer_secret,access_token,access_secret)
# job_list1=c(job_list)


#현재 날짜로 부터 일주일 전
date=as.Date(-7,origin = Sys.Date()) # 현재 날짜로 부터 일주일 전
date1=as.character(date)
# 형변환

#감정사전 불러오기
#pos.word=read.table('/mount/service/data/positive.txt')
#neg.word=read.table('/mount/service/data/negative.txt')
pos.word=read.table('/root/hanium/service/child/positive.txt')
neg.word=read.table('/root/hanium/service/child/negative.txt')
pos.word = pos.word$V1
neg.word = neg.word$V1
score.sentiment=function(sentences, pos.words, neg.words, .progress='none'){
  score=laply(sentences, function(sentence,pos.words,neg.words) {
    #문장에서 불필요한 요소 삭제
    sentence=gsub('[[:punct:]]','',sentence)
    sentence=gsub('[[:cntrl:]]','',sentence)
    sentence=gsub('\\d+','',sentence)
    sentence=str_replace_all(sentence,"[^[:graph:]]","")
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
job_lists=c()#선언
search_count=c()
rred = c()
#lon = 37.517
#lan = 127.047
#category<- c("닭","오리","치킨","교촌","bhc","통닭")
geo = paste(lat,",",lng,",10km",sep="") 
for(i in 1:length(category)){
  
  x=enc2utf8(category[i])
  x_search=searchTwitter(x,since=date1,geocode=geo,lang="ko",n=50)
  
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

red_score<-score.sentiment(rred, pos.word, neg.word, .progress='none')


#  #칼럼 리코딩
red_score$remark[red_score$score >=1] = '긍정'
red_score$remark[red_score$score ==0] = '중립'
red_score$remark[red_score$score < 0] = '부정'

sentiment_result= table(red_score$remark)
frame = data.frame(sentiment_result)
colnames(frame)=c("감정","빈도")




# setup_twitter_oauth(consumer_key,consumer_secret,access_token,access_secret)



date1<-as.Date(-14,origin = Sys.Date()) # 현재 날짜로 부터 일주일 전
date<-as.character(date1)

f<-function(word){
  F_search_count = data.frame()
  for(i in 1:length(word)){
    word <-enc2utf8(word[i])
    T_sentence <- searchTwitter(word,since=date,geocode='35.874,128.246,400km',lang = "ko",n=50)
 
    T_sentence.df <- twListToDF(T_sentence)
    T_sentence.text <-T_sentence.df$text
  
      # 불필요한 문자를 필터링
     T_sentence.text <- gsub("\n", "",T_sentence.text)
     T_sentence.text <- gsub("카톡문의", "",T_sentence.text)
     T_sentence.text <- gsub("포인트", "",T_sentence.text)
     T_sentence.text <- gsub("신규꽁머니", "",T_sentence.text)
     T_sentence.text <- gsub("배너인증업체", "",T_sentence.text)
     T_sentence.text <- gsub("사다리", "",T_sentence.text)
     T_sentence.text <- gsub("안전놀이터", "",T_sentence.text)
     T_sentence.text <- gsub("카톡", "",T_sentence.text)
     T_sentence.text <- gsub("\r", "",T_sentence.text)
     T_sentence.text <- gsub("RT", "",T_sentence.text)
     T_sentence.text <- gsub("H3", "",T_sentence.text)
     T_sentence.text <- gsub("개발자","",T_sentence.text)
     T_sentence.text <- gsub("컨퍼런스","",T_sentence.text)
     T_sentence.text <- gsub("co","",T_sentence.text)
     T_sentence.text <- gsub("세션","",T_sentence.text)
     T_sentence.text <- gsub("h3","",T_sentence.text)
     T_sentence.text <- gsub("2012","",T_sentence.text)
     T_sentence.text <- gsub("http","",T_sentence.text)
     T_sentence.text <- gsub("https","",T_sentence.text)
     T_sentence.text <- gsub("ㅋㅋㅋㅋ","",T_sentence.text)
     T_sentence.text <- gsub("ㅋㅋㅋㅋㅋㅋㅋ","",T_sentence.text)
     T_sentence.text <- gsub("//x","",T_sentence.text)
     T_sentence.text <- gsub("//d+","",T_sentence.text)
      
      
      # 문자 분리
     T_sentence_nouns <- Map(extractNoun,T_sentence.text)
      
      
     T_sentence_word <- unlist(T_sentence_nouns, use.name=F)
     T_sentence_word <- gsub("[[:punct:]]","",T_sentence_word)
     T_sentence_word <- Filter(function(x){nchar(x)>=2},T_sentence_word)
      
     # T_sentence_word
      # 단어별 카운팅
     T_sentence_count <- table(T_sentence_word)
      
     # T_sentence_count
      
      df <- data.frame(T_sentence_count)
      
      
      # df$Freq
      desc_df<-arrange(df, desc(df$Freq))
      F_search_count = rbind(F_search_count,desc_df)
      colnames(F_search_count)=c("word","count")
      return(F_search_count)
      }
}

word_freq=f(category)

LIST = list("feeling"=frame,"words"=word_freq)
toJSON(LIST)
