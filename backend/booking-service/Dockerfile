FROM openjdk:17-jdk-slim

WORKDIR /app
COPY . .

RUN ./gradlew build -x test

EXPOSE 8080
CMD ["java", "-jar", "build/libs/booking-service-0.0.1-SNAPSHOT.jar"]
