// Get the current URL path
            const path = window.location.pathname;
            
            // Split the path by '/' and filter out empty segments
            const segments = path.split('/').filter(segment => segment.trim() !== '');

            // Check if segments array is empty
            if (segments.length === 0) {
                // Fetch the ID from the server if segments array is empty
                fetch('/iduniqueload')
                    .then(response => response.json())
                    .then(data => {
                        // Use the ID in the response
                        const uniqueID = document.getElementById('uniqueID');
                        uniqueID.textContent = data.id;
                    })
                    .catch(error => {
                        console.error('Error fetching ID:', error);
                    });
            } else {
                // Use the last segment of the URL path
                const lastSegment = segments[segments.length - 1];
                const uniqueID = document.getElementById('uniqueID');
                uniqueID.textContent = lastSegment;
            }