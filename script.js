const fromCurrency = document.getElementById('from-currency');
const toCurrency = document.getElementById('to-currency');
const amount = document.getElementById('amount');
const result = document.getElementById('result');
const swapBtn = document.getElementById('swap');
const fromFlag = document.getElementById('from-flag');
const toFlag = document.getElementById('to-flag');

// Helper function to get flag URL
function getFlagUrl(currencyCode) {
  return `https://flagsapi.com/${currencyCode.slice(0, 2)}/flat/64.png`;
}

// Populate dropdowns and flags
fetch('https://api.exchangerate-api.com/v4/latest/USD')
  .then(res => res.json())
  .then(data => {
    const currencies = Object.keys(data.rates);
    currencies.forEach(cur => {
      let option1 = document.createElement("option");
      let option2 = document.createElement("option");
      option1.value = option2.value = cur;
      option1.text = option2.text = cur;
      fromCurrency.appendChild(option1);
      toCurrency.appendChild(option2);
    });

    fromCurrency.value = 'USD';
    toCurrency.value = 'INR';
    updateFlags();
  });

function updateFlags() {
  fromFlag.src = getFlagUrl(fromCurrency.value);
  toFlag.src = getFlagUrl(toCurrency.value);
}

fromCurrency.addEventListener('change', updateFlags);
toCurrency.addEventListener('change', updateFlags);

swapBtn.addEventListener('click', () => {
  const temp = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = temp;
  updateFlags();
  convertCurrency();
});

function convertCurrency() {
  const from = fromCurrency.value;
  const to = toCurrency.value;
  const amt = parseFloat(amount.value);

  if (isNaN(amt) || amt <= 0) {
    result.textContent = 'Please enter a valid amount.';
    return;
  }

  fetch(`https://api.exchangerate-api.com/v4/latest/${from}`)
    .then(res => res.json())
    .then(data => {
      const rate = data.rates[to];
      const converted = (amt * rate).toFixed(2);
      result.textContent = `${amt} ${from} = ${converted} ${to}`;
    })
    .catch(() => {
      result.textContent = 'Error fetching rate.';
    });
}
