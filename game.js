const state = {
  wood: 0,
  ore: 0,

  skills: {
    woodcutting: {
      level: 1
    },
    mining: {
      level: 1
    }
  },

  equipment: []
};


// ================== 生活技能 ==================

function chopWood() {
  const lv = state.skills.woodcutting.level;
  const gain = lv; // 每级 +1 木头

  state.wood += gain;
  log(`你砍树获得了 ${gain} 木头`);
  save();
  render();
}


function mineOre() {
  const lv = state.skills.mining.level;
  const gain = lv;

  state.ore += gain;
  log(`你挖矿获得了 ${gain} 矿石`);
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
  document.getElementById("woodcutLv").innerText =
  state.skills.woodcutting.level;

document.getElementById("miningLv").innerText =
  state.skills.mining.level;


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
function upgradeWoodcutting() {
  const skill = state.skills.woodcutting;
  const cost = skill.level * 10;

  if (state.wood < cost) {
    alert("木头不足！");
    return;
  }

  state.wood -= cost;
  skill.level++;
  log(`砍树技能升级到 Lv${skill.level}`);
  save();
  render();
}

function upgradeMining() {
  const skill = state.skills.mining;
  const cost = skill.level * 10;

  if (state.ore < cost) {
    alert("矿石不足！");
    return;
  }

  state.ore -= cost;
  skill.level++;
  log(`挖矿技能升级到 Lv${skill.level}`);
  save();
  render();
}
