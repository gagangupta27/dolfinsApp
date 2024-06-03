import { EventSourcePolyfill } from "event-source-polyfill";
import "react-native-url-polyfill/auto";
import Api from "./Api";

async function askGPT(context, question) {
  const res = await Api.post(
    "/api/1.0/user/intelligence/answer",
    (data = { question: context + "\n" + question + "\n" })
  );
  return res.data.reply;
}

async function chatGpt(messages) {
  const res = await Api.post(
    "/api/1.0/user/intelligence/chat",
    (data = { messages: messages })
  );
  return res.data.reply;
}

function chatGptStream(messages, onMessageReceived) {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        // Step 1: Send messages to create a query
        const createQueryResponse = await Api.post(
          "/api/1.0/user/query/create",
          { messages: messages }
        );
        const queryData = createQueryResponse.data;
        const queryId = queryData.id; // Assuming the response includes the query ID

        // Step 2: Listen to the response stream for the created query
        const url = `${Api.defaults.baseURL}/api/1.0/user/query/${queryId}/response`;
        const stream = new EventSourcePolyfill(url, {
          headers: {
            "Content-Type": "application/json",
            Accept: "text/event-stream",
            Authorization: Api.defaults.headers.common["Authorization"],
          },
        });

        stream.addEventListener("message", function (event) {
          const data = JSON.parse(event.data);
          if (data.reply) {
            onMessageReceived(data.reply); // Call the callback with each piece of the message
          }
        });

        stream.addEventListener("end-of-stream", function (event) {
          console.log("End of stream received. Closing connection.");
          stream.close(); // Close the connection from the client side
          resolve();
        });

        stream.onerror = function (error) {
          console.error("Stream encountered an error:", error);
          stream.close();
          reject(error);
        };

        stream.onclose = function () {
          console.log("Stream closed");
          resolve();
        };
      } catch (error) {
        reject(error);
      }
    })();
  });
}

export { askGPT, chatGpt, chatGptStream };
