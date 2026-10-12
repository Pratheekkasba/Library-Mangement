# Multi-stage build for Spring Boot on Render
FROM maven:3.8.5-openjdk-11 AS build
WORKDIR /app
COPY libraryms-app-rest/pom.xml .
COPY libraryms-app-rest/src ./src
RUN mvn clean package -DskipTests

# Run stage
FROM openjdk:11-jre-slim
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENV PORT=8080
ENTRYPOINT ["java", "-jar", "app.jar"]
