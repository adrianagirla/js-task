const maxLots = 10;
let parkingLot = [];
let availableLots = maxLots;

function initializeParkingLot() {
  parkingLot = JSON.parse(localStorage.getItem("parkingLot")) || [];
  availableLots = maxLots - parkingLot.length;
  updateParkingLotStatus();
}

function enterParking() {
  if (availableLots === 0) {
    alert("No more lots left in the parking!");
    return;
  }

  const plateNumberInput = document.getElementById("plate-number");
  const plateNumber = plateNumberInput.value;
  if (!plateNumber) {
    alert("Please enter a plate number.");
    return;
  }

  const entryTime = new Date();
  parkingLot.push({ plateNumber, entryTime });
  plateNumberInput.value = ""; // Clear the input field
  availableLots--;
  updateParkingLotStatus();
  saveParkingLotToLocalStorage();
}

function exitCar(plateNumber) {
  const exitTime = new Date();
  const car = parkingLot.find((entry) => entry.plateNumber === plateNumber);

  if (car) {
    const entryTime = car.entryTime;
    const timeSpent = Math.ceil((exitTime - entryTime) / (1000 * 60 * 60)); // in hours
    const totalAmount = calculateParkingFee(timeSpent);
    const summary = `Plate Number: ${plateNumber}, Time Spent: ${timeSpent} hours, Total Amount: ${totalAmount} RON`;
    document.getElementById("summary").innerText = summary;
    parkingLot.splice(parkingLot.indexOf(car), 1);
    availableLots++;
    updateParkingLotStatus();
    saveParkingLotToLocalStorage();

    setTimeout(() => {
      document.getElementById("summary").innerText = "";
    }, 10000); // Clear the summary after 10 seconds
  }
}

function calculateParkingFee(timeSpent) {
  if (timeSpent <= 1) {
    return 10; // 10 RON for the first hour
  } else {
    return 10 + (timeSpent - 1) * 5; // 5 RON for each additional hour
  }
}

function updateParkingLotStatus() {
  document.getElementById("available-lots").innerText = availableLots;
  document.getElementById("parked-cars").innerText = parkingLot.length;
  const parkingLotElement = document.getElementById("parking-lot");
  parkingLotElement.innerHTML = "";
  parkingLot.forEach((entry) => {
    const listItem = document.createElement("li");
    listItem.innerText = `Plate Number: ${
      entry.plateNumber
    }, Entry Time: ${entry.entryTime.toLocaleString()}`;
    const exitButton = document.createElement("button");
    exitButton.innerText = "Exit";
    exitButton.onclick = () => exitCar(entry.plateNumber);
    listItem.appendChild(exitButton);
    parkingLotElement.appendChild(listItem);
  });
}

function saveParkingLotToLocalStorage() {
  localStorage.setItem("parkingLot", JSON.stringify(parkingLot));
}

// Initialize parking lot data from localStorage
initializeParkingLot();
