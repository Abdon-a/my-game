const state = {
  wood: 0,
  ore: 0,

  skills: {
    woodcutting: { level: 1 },
    mining: { level: 1 }
  },

  player: {
    baseAtk: 5,
    baseDef: 2,
    maxHp: 50,
    hp: 50,
    equipment: {
      weapon: null,
      armor: null
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
  state.lastTime = Date.now(); // 
  localStorage.setItem("idle-game", JSON.stringify(state));
}

function load() {
  const data = localStorage.getItem("idle-game");
  if (!data) return;

  const saved = JSON.parse(data);

  // === 离线收益计算 ===
  if (saved.lastTime) {
    const now = Date.now();
    const diff = Math.floor((now - saved.lastTime) / 1000); // 秒

    const woodGain =
      diff * saved.skills.woodcutting.level / 5;
    const oreGain =
      diff * saved.skills.mining.level / 5;

    saved.wood += Math.floor(woodGain);
    saved.ore += Math.floor(oreGain);

    alert(
      `你离线了 ${diff} 秒\n` +
      `获得木头 ${Math.floor(woodGain)}\n` +
      `获得矿石 ${Math.floor(oreGain)}`
    );
  }

  Object.assign(state, saved);
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
  const stats = getPlayerStats();
document.getElementById("hp").innerText =
  `${state.player.hp}/${state.player.maxHp}`;
document.getElementById("atk").innerText = stats.atk;
document.getElementById("def").innerText = stats.def;
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
function autoGather() {
  // 砍树
  const woodLv = state.skills.woodcutting.level;
  state.wood += woodLv;

  // 挖矿
  const oreLv = state.skills.mining.level;
  state.ore += oreLv;

  log(`自动采集：木头 +${woodLv}，矿石 +${oreLv}`);
  save();
  render();
}
setInterval(autoGather, 5000);

function getPlayerStats() {
  let atk = state.player.baseAtk;
  let def = state.player.baseDef;

  const eq = state.player.equipment;

  if (eq.weapon) atk += eq.weapon.atk;
  if (eq.armor) def += eq.armor.def;

  return { atk, def };
}

function equipItem(index) {
  const item = state.equipment[index];
  if (!item.slot) return;

  state.player.equipment[item.slot] = item;
  log(`装备了 ${item.name}`);
  save();
  render();
}
function craftSword() {
  if (state.ore < 20) {
    alert("矿石不足");
    return;
  }

  state.ore -= 20;

  const sword = {
    name: "铁剑",
    slot: "weapon",
    atk: 5,
    def: 0
  };

  state.equipment.push(sword);
  log("你锻造了一把铁剑");
  save();
  render();
}





