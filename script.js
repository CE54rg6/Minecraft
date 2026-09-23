// المتغيرات
let selectedTool = null;
let selectedBlock = null;

let inventory = {
  grass: 0,
  dirt: 0,
  rock: 0,
  wood: 0,
  leaves: 0
};

// العالم الأصلي
const originalWorld = [
  ["sky","sky","sky","sky","sky","sky","sky","sky","sky","sky","sky","sky","sky","sky","sky","sky","sky","sky","sky","sky","sky","sky","sky","sky","sky","sky","sky","sky","sky","sky","sky","sky","sky","sky","sky"],
  ["sky","sky","sky","sky","cloud","cloud","sky","sky","sky","sky","sky","sky","cloud","cloud","cloud","sky","sky","sky","sky","sky"],
  ["sky","sky","sky","sky","sky","sky","sky","sky","sky","sky","sky","sky","sky","sky","sky","sky","sky","sky","sky","sky"],
  ["sky","sky","sky","sky","sky","sky","sky","sky","sky","sky","sky","sky","sky","sky","sky","sky","sky","sky","sky","sky"],
  ["sky","sky","sky","leaves","leaves","sky","sky","sky","sky","sky","sky","sky","sky","leaves","leaves","sky","sky","sky","sky","sky"],
  ["sky","sky","sky","leaves","leaves","sky","sky","sky","sky","rock","sky","sky","sky","leaves","leaves","sky","sky","sky","sky","sky"],
  ["sky","sky","sky","wood","wood","sky","sky","sky","rock","rock","rock","sky","sky","wood","wood","sky","sky","sky","sky","sky"],
  ["grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"],
  ["dirt","dirt","dirt","dirt","dirt","dirt","dirt","dirt","dirt","dirt","dirt","dirt","dirt","dirt","dirt","dirt","dirt","dirt","dirt","dirt"],
  ["dirt","dirt","dirt","dirt","dirt","dirt","dirt","dirt","dirt","dirt","dirt","dirt","dirt","dirt","dirt","dirt","dirt","dirt","dirt","dirt"],
  ["dirt","dirt","dirt","dirt","dirt","dirt","dirt","dirt","dirt","dirt","dirt","dirt","dirt","dirt","dirt","dirt","dirt","dirt","dirt","dirt"],
  ["dirt","dirt","dirt","dirt","dirt","dirt","dirt","dirt","dirt","dirt","dirt","dirt","dirt","dirt","dirt","dirt","dirt","dirt","dirt","dirt"]
];

let world = JSON.parse(JSON.stringify(originalWorld)); // نسخ العالم

// رسم العالم
function renderWorld() {
  const worldDiv = document.getElementById("world");
  worldDiv.innerHTML = "";

  for (let row = 0; row < world.length; row++) {
    for (let col = 0; col < world[row].length; col++) {
      const tile = document.createElement("div");
      tile.className = "tile tile-" + world[row][col];
      tile.dataset.row = row;
      tile.dataset.col = col;
      worldDiv.appendChild(tile);
    }
  }
}

// تحديث أرقام المخزون
function updateInventory() {
  document.getElementById("count-grass").textContent = inventory.grass;
  document.getElementById("count-dirt").textContent = inventory.dirt;
  document.getElementById("count-rock").textContent = inventory.rock;
  document.getElementById("count-wood").textContent = inventory.wood;
  document.getElementById("count-leaves").textContent = inventory.leaves;
}

// اختيار أداة
function selectTool(tool) {
  selectedTool = tool;
  selectedBlock = null;

  document.querySelectorAll(".tool").forEach(t => t.classList.remove("selected"));
  document.getElementById(tool).classList.add("selected");
  document.querySelectorAll(".inv-item").forEach(i => i.classList.remove("selected"));
}

// اختيار بلوك من المخزون
function selectBlock(type) {
  if (inventory[type] <= 0) return;

  selectedBlock = type;
  selectedTool = null;

  document.querySelectorAll(".tool").forEach(t => t.classList.remove("selected"));
  document.querySelectorAll(".inv-item").forEach(i => i.classList.remove("selected"));
  document.getElementById("inv-" + type).classList.add("selected");
}

// الضغط على مربع
function clickTile(row, col) {
  const current = world[row][col];

  // وضع بلوك
  if (selectedBlock) {
    if (current === "sky" || current === "cloud") {
      world[row][col] = selectedBlock;
      inventory[selectedBlock]--;
      renderWorld();
      updateInventory();
    }
    return;
  }

  // كسر بلوك
  if (!selectedTool) return;

  if (
    (selectedTool === "axe" && (current === "wood" || current === "leaves")) ||
    (selectedTool === "pickaxe" && current === "rock") ||
    (selectedTool === "shovel" && (current === "dirt" || current === "grass"))
  ) {
    inventory[current]++;
    world[row][col] = "sky";
    renderWorld();
    updateInventory();
  }
}

// Reset
function resetGame() {
  world = JSON.parse(JSON.stringify(originalWorld));
  inventory = { grass: 0, dirt: 0, rock: 0, wood: 0, leaves: 0 };
  selectedTool = null;
  selectedBlock = null;

  document.querySelectorAll(".tool").forEach(t => t.classList.remove("selected"));
  document.querySelectorAll(".inv-item").forEach(i => i.classList.remove("selected"));

  renderWorld();
  updateInventory();
}

// تشغيل اللعبة
renderWorld();
updateInventory();

// أحداث الأدوات
document.getElementById("axe").onclick = () => selectTool("axe");
document.getElementById("pickaxe").onclick = () => selectTool("pickaxe");
document.getElementById("shovel").onclick = () => selectTool("shovel");

// أحداث المخزون
document.getElementById("inv-grass").onclick = () => selectBlock("grass");
document.getElementById("inv-dirt").onclick = () => selectBlock("dirt");
document.getElementById("inv-rock").onclick = () => selectBlock("rock");
document.getElementById("inv-wood").onclick = () => selectBlock("wood");
document.getElementById("inv-leaves").onclick = () => selectBlock("leaves");

// الضغط على العالم
document.getElementById("world").onclick = function(e) {
  if (e.target.classList.contains("tile")) {
    clickTile(e.target.dataset.row, e.target.dataset.col);
  }
};

// زر Reset
document.getElementById("reset-btn").onclick = resetGame;