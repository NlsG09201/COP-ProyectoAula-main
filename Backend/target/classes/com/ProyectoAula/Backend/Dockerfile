# Use the official OpenJDK 17 slim image as base
FROM openjdk:17-jdk-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the Maven wrapper and pom.xml to download dependencies first (for better layer caching)
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Grant execution permission to the Maven wrapper and download dependencies
RUN chmod +x ./mvnw
RUN ./mvnw dependency:go-offline -B

# Copy the rest of the source code
COPY src ./src

# Build the application
RUN ./mvnw clean package -DskipTests

RUN mv target/*.jar app.jar
EXPOSE 8080

ENV DB_HOST=162.241.2.168 \
    DB_PORT=3306 \
    DB_NAME=nelsonda_COP \
    DB_USER= \
    DB_PASSWORD=

ENV SPRING_DATASOURCE_URL=jdbc:mysql://$DB_HOST:$DB_PORT/$DB_NAME?useUnicode=true&characterEncoding=utf8&serverTimezone=America/Bogota&useSSL=false&allowPublicKeyRetrieval=true&autoReconnect=true \
    SPRING_DATASOURCE_USERNAME=$DB_USER \
    SPRING_DATASOURCE_PASSWORD=$DB_PASSWORD \
    SPRING_DATASOURCE_DRIVER_CLASS_NAME=com.mysql.cj.jdbc.Driver

ENTRYPOINT ["java", "-jar", "app.jar", "--spring.profiles.active="]

HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD wget --spider -q http://localhost:8080 || exit 1
