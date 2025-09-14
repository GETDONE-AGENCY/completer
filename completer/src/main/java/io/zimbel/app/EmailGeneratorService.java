package io.zimbel.app;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class EmailGeneratorService {

   
    private final WebClient webclient;

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    public EmailGeneratorService(WebClient.Builder webclientBuilder){
        this.webclient = webclientBuilder.build();
    }


    public String generateEmailReply(EmailRequest emailRequest){
        //build the prompt
        String prompt = buildPrompt(emailRequest);
        //craft the request
        Map<String, Object> requestBody = Map.of(
            "contents", new Object[] {
                Map.of("parts", new Object[]{
                    Map.of("text", prompt)
                })
            }
        );
        //make req and get response
        try{
            String response = webclient.post()
                .uri(geminiApiUrl)
                .header("Content-Type", "application/json")
                .header("x-goog-api-key", geminiApiKey)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();
            //extract response
            return extractResponseContent(response);
            } catch( Exception e)
            {
                return "Error processing req " + e.getMessage();
            }
        }

    private String extractResponseContent(String response){
        try{
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(response);
            return rootNode.path("candidates")
                .get(0)
                .path("content")
                .path("parts")
                .get(0)
                .path("text")
                .asText();

        } catch (Exception e){
            return "Error processing req " + e.getMessage();
        }
    }

    private String buildPrompt(EmailRequest emailRequest){
        StringBuilder prompt = new StringBuilder();
        prompt.append("Generate a professional email reply for the following email content. Do not generate Subject Line. GENERATE ONLY THE RESPONSE TEXT; NOTHING ELSE");
        if (emailRequest.getTone() != null && !emailRequest.getTone().isEmpty()){
            prompt.append("Use a ").append(emailRequest.getTone()).append("tone.");
        }
        prompt.append("Original email:").append(emailRequest.getEmailContent());
        return prompt.toString();
    }
    
} 
