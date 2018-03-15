FROM anapsix/alpine-java:8_jdk_unlimited
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.ustc.edu.cn/' /etc/apk/repositories
RUN apk update && apk add ca-certificates
RUN apk add tzdata
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && echo "Asia/Shanghai" > /etc/timezone
VOLUME /tmp
ADD <%=projectName%>-app-<%=proVersion%>-exec.jar app.jar
RUN sh -c 'touch /app.jar'
RUN echo $(date) > /image_built_at
EXPOSE 8088
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-Xms4096m","-Xmx4096m","-Xmn2048m","-XX:MaxDirectMemorySize=2048m","-XX:MetaspaceSize=128m","-XX:MaxMetaspaceSize=512m","-XX:ReservedCodeCacheSize=240M","-jar","/app.jar","--spring.profiles.active=${SPRING_PROFILES_ACTIVE}"]
