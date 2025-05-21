# Running the Multimodal AI Chat App with LM Studio using a locally loaded model
I explore how to run large language models (LLMs) locally on your machine—such as a high-end notebook—using LM Studio. You'll see how to select a quantized model that’s compatible with your hardware and discover how easy it is to use LM Studio with local models like Gemma, DeepSeek, Croc, and others. The process requires only beginner-level experience.

Running models locally is ideal when you want to keep your data private, avoid subscription costs, and continue working while traveling—even on airplanes without an internet connection.

LM Studio also supports programmatic use through its built-in server, enabling developers to build custom applications powered by locally running models—without incurring costs for accessing proprietary model APIs.

One of the great advantages of locally running tools like LM Studio is that, in addition to their own APIs, they support the OpenAI SDK, which has become the de facto standard for interacting with LLMs. The [multi modal chat app]( https://github.com/Ashot72/Multi-Modal-Chat) application I previously built was able to connect to the LM Studio server locally by changing just two settings: the baseURL, pointing to the local server, and the model name to reference the locally loaded model. No API key is required, as everything runs entirely on the local machine.

To show how it works, I used the Google Gemma small model. I shared my hardware profile on Hugging Face to make sure it would run. It wasn’t super fast, but it worked well enough to demonstrate the app.

Supervisor Agent determines which agent to use and routes the user prompt accordingly.

To get started.
```
 # Clone the repository

         git clone https://github.com/Ashot72/LM-Studio-local-chat-app
         cd LM-Studio-local-chat-app

       # Create the .env file based on the env.example.txt file and include the respective keys.
       
       # installs dependencies
         yarn install

       # to run locally
         npm run dev
    
       # to run in production mode
         npm run build
         npm start
    
```

Go to [LM Studio Video](https://youtu.be/DW75yo6W710) page

Go to [LM Studio Description](https://ashot72.github.io/LM-Studio-local-chat-app/doc.html) page
