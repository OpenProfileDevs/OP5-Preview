function redactAndSendMessage(name, button) {
    localStorage.setItem('discordwavesent', 'sent');
    button.style.display = "none";
    //stopVibration();
    alert('Thanks for your wave!');
    redactName(name)
        .then(redactedName => {
            const message = `👋 **${redactedName}** sent a wave from web!`;
            sendMessageToDiscord(message);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function redactName(name) {
    // Fetching words from the text file
    return fetch('/blacklist.txt')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch blacklist');
            }
            return response.text();
        })
        .then(data => {
            const blacklist = data.split(',').map(word => word.trim());
            // Checking if the name contains any blacklisted words
            for (const word of blacklist) {
                const pattern = new RegExp(`\\b${word}\\b`, 'gi');
                name = name.replace(pattern, '#');
            }
            return name;
        });
}

function getDiscordWebhookURL() {
    return fetch('/webhook.txt')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch Discord webhook URL');
            }
            return response.text();
        });
}

function sendMessageToDiscord(message) {
    getDiscordWebhookURL()
        .then(webhookURL => {
            fetch(webhookURL.trim(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: message }),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to send message to Discord');
                }
                console.log('Message sent to Discord successfully');

                // Auto-react with wave emoji
                const messageData = response.json();
                if (messageData && messageData.id) {
                    const reactionURL = `${webhookURL.trim()}/messages/${messageData.id}/reactions/👋/@me`;
                    fetch(reactionURL, {
                        method: 'PUT',
                    })
                    .then(() => {
                        console.log('Auto reaction added');
                    })
                    .catch(error => {
                        console.error('Error adding auto reaction:', error);
                    });
                }
            })
            .catch(error => {
                console.error('Error sending message to Discord:', error);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}