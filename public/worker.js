
addEventListener("message", async (message) => {
    const {command, number} = message.data;
    if (command === "get cat images") {
        const response = await fetch(`http://localhost:3000/catapi/${number}`);
        if (!response.ok){
          throw new Error('HTTP error!', response.status);
        }
        const result = await response.json();
        postMessage({ result });
    }
  });
