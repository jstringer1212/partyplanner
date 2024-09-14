const cohort = "2407-FTB-ET-WEB-PT"
const Apiurl = 'https://fsa-crud-2aa9294fe819.herokuapp.com/api/${cohort}/events';

const state = {
    Events: [],
};

const form = document.querySelector("form");
form.addEventListener("submit", addEvents);

getEvents();
async function getEvents() {
    try {
        const response = await fetch(Apiurl);
        const json = await response.json();
        state.Events = json.data;     
    } catch (error) {
        console.error("Error fetching events:", error);
    }
};

async function render() {
    await getEvents();
    renderEvents(state.Events);
    
};
render();

async function addEvents(events) {
    events.preventDefault();
    const name = document.querySelector('#name').value;
    const dateInput = document.querySelector('#date').value;
    const location = document.querySelector('#location').value;
    const time = document.querySelector('#time').value;
    const description = document.querySelector('#description').value;

    //convert date
    const newDate = new Date(`${dateInput}T${time}`).toISOString();
    const data = {
        name,
        date: newDate,
        location,
        description
    };
    try {
        const response = await fetch(Apiurl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const json = await response.json();
    
        // Re-fetch and render the events after adding
        render();
    } catch (error) {
        console.error('Error adding event:', error);
    }
    getEvents();
};


function renderEvents(events) {
    const eventList = document.querySelector('#event-list');
    
    if (!eventList) {
        console.error('The element #event-list was not found');
        return;
    }

    eventList.innerHTML = ''; // Clear the event list

    events.forEach(event => {
        const eventDate = new Date(event.date);
        const formattedDate = eventDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        const formattedTime = eventDate.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });

        const eventItem = document.createElement('div');
        eventItem.innerHTML = `
            <li>Event: ${event.name}</li>
            <li>Date: ${formattedDate}, ${formattedTime}</li>
            <li>Location: ${event.location}</li>
            <li>Description: ${event.description}</li>
            <p><button class="delete-btn">Delete</button></p>
        `;

        // Add delete event listener
        const deleteButton = eventItem.querySelector('.delete-btn');
        // adds a button to each event that deletes that event only
        deleteButton.addEventListener('click', async () => {
            try {
                const response = await fetch(`${Apiurl}/${event.id}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    console.log(`Event with ID: ${event.id} deleted successfully.`);
                    render(); // Re-render after deletion if else needed here so 
                } else {
                    console.error(`Failed to delete event: ${response.status}`);
                }
            } catch (error) {
                console.error('Error deleting event:', error);
            }
        });

        eventList.appendChild(eventItem);
    });
}



