const state = {
  wood: 0,
  ore: 0,
  equipment: []
};

// ================== 生活技能 ==================

function chopWood() {
  state.wood += 1;
  save();
  render();
}

function mineOre() {
  state.ore += 1;
  save();
  render();
}

// ================== 制造 ==================

function craftSword() {
  if (state.wood < 10 || state.ore < 10) {
    alert("资源不足！");
    return;
  }

  state.wood -= 10;
  state.ore -= 10;

  const sword = generateEquipment("铁剑");
  state.equipment.push(sword);

  log(`你制造了一把 ${formatItem(sword)}`);
  save();
  render();
}

// ================== 战斗 & 掉落 ==================

function fightMonster() {
  const dropChance = Math.random();
  if (dropChance < 0.6) {
    log("你击败怪物，但什么也没掉");
    return;
  }

  const item = generateEquipment("怪物掉落");
  state.equipment.push(item);
  log(`怪物掉落了 ${formatItem(item)}`);
  save();
  render();
}

// ================== 随机装备 ==================

function generateEquipment(name) {
  return {
    name,
    atk: rand(1, 10),
    def: rand(0, 5),
    rarity: getRarity()
  };
}

function getRarity() {
  const r = Math.random();
  if (r < 0.6) return "普通";
  if (r < 0.85) return "稀有";
  if (r < 0.97) return "史诗";
  return "传说";
}

function formatItem(item) {
  return `【${item.rarity}】${item.name} ATK+${item.atk} DEF+${item.def}`;
}

// ================== 工具 ==================

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function log(msg) {
  document.getElementById("battleLog").innerText = msg;
}

// ================== 存档 ==================

function save() {
  localStorage.setItem("idleGameSave", JSON.stringify(state));
}

function load() {
  const save = localStorage.getItem("idleGameSave");
  if (save) Object.assign(state, JSON.parse(save));
}

// ================== 渲染 ==================

function render() {
  document.getElementById("wood").innerText = state.wood;
  document.getElementById("ore").innerText = state.ore;

  const list = document.getElementById("equipmentList");
  list.innerHTML = "";
  state.equipment.forEach(e => {
    const li = document.createElement("li");
    li.innerText = formatItem(e);
    list.appendChild(li);
  });
}

// ================== 初始化 ==================

load();
render();
