# Use an official OpenJDK runtime as a parent image
FROM openjdk:21-slim

# Set the working directory inside the container
WORKDIR /app

# Argument to hold the path to the JAR file
ARG JAR_FILE=target/*.jar

# Copy the packaged .jar file from the build context into the container
COPY ${JAR_FILE} app.jar

# Specify the command to run on container startup
ENTRYPOINT ["java", "-jar", "app.jar"]