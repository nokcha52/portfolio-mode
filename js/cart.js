const cartItem = {
    id: Date.now(),
    name: keyboardType.charAt(0).toUpperCase() + keyboardType.slice(1),
    options: { ...selectedNames },
    price: parseFloat(unitPrice.toFixed(2)),
    qty: quantity,
    image: selectedImage   // ← 추가
};