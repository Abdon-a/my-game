/**********************
 * 全局状态
 **********************/
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

  monster: null,
  equipment: [],

  lastTime: Date.now()
};

/**********************
 * 工具
 **********************/
function log(msg) {
  const el = document.getElementById("battleLog");
  if (!el) return;
  el.innerText = msg;
}

/**********************
 * 存档
 **********************/
function save() {
  state.lastTime = Date.now();
  localStorage.setItem("idle-game", JSON.stringify(state));
}

function load() {
  const data = localStorage.getItem("idle-game");
  if (!data) return;

  const saved = JSON.parse(data);

  // 离线收益（采集）
  if (saved.lastTime) {
    const diff = Math.floor((Date.now() - saved.lastTime) / 1000);

    const woodGain =
      Math.floor(diff / 5) * saved.skills.woodcutting.level;
    const oreGain =
      Math.floor(diff / 5) * saved.skills.mining.level;

    saved.wood += woodGain;
    saved.ore += oreGain;

    alert(
      `你离线了 ${diff} 秒\n获得木头 ${woodGain}\n获得矿石 ${oreGain}`
    );
  }

  Object.assign(state, saved);
}

/**********************
 * 采集（自动）
 **********************/
function autoGather() {
  state.wood += state.skills.woodcutting.level;
  state.ore += state.skills.mining.level;
  save();
  render();
}
setInterval(autoGather, 5000);

/**********************
 * 技能升级
 **********************/
function upgradeWoodcutting() {
  state.skills.woodcutting.level++;
  save();
  render();
}

function upgradeMining() {
  state.skills.mining.level++;
  save();
  render();
}

/**********************
 * 锻造
 **********************/
function craftSword() {
  if (state.ore < 10 || state.wood < 10) {
    alert("资源不足");
    return;
  }

  state.ore -= 10;
  state.wood -= 10;

  const sword = {
    name: "铁剑",
    slot: "weapon",
    atk: 5,
    def: 0
  };

  state.equipment.push(sword);
  save();
  render();
}

/**********************
 * 装备
 **********************/
function equipItem(index) {
  const item = state.equipment[index];
  if (!item) return;
  state.player.equipment[item.slot] = item;
  save();
  render();
}

function getPlayerStats() {
  let atk = state.player.baseAtk;
  let def = state.player.baseDef;

  const eq = state.player.equipment;
  if (eq.weapon) atk += eq.weapon.atk;
  if (eq.armor) def += eq.armor.def;

  return { atk, def };
}

/**********************
 * 战斗系统（自动）
 **********************/
function spawnMonster() {
  state.monster = {
    name: "史莱姆",
    hp: 30,
    atk: 4
  };
  log("出现了一只史莱姆！");
}

function dropLoot() {
  if (Math.random() < 0.5) {
    const armor = {
      name: "破旧护甲",
      slot: "armor",
      atk: 0,
      def: Math.floor(Math.random() * 3) + 1
    };
    state.equipment.push(armor);
    log("怪物掉落了一件装备！");
  }
}

function fightOnce() {
  const m = state.monster;
  if (!m) return;

  const stats = getPlayerStats();

  m.hp -= Math.max(1, stats.atk - 1);
  state.player.hp -= Math.max(1, m.atk - stats.def);

  if (m.hp <= 0) {
    log("你击败了史莱姆！");
    dropLoot();
    state.monster = null;
  }

  if (state.player.hp <= 0) {
    log("你倒下了，已恢复生命");
    state.player.hp = state.player.maxHp;
    state.monster = null;
  }

  save();
  render();
}

function autoBattleLoop() {
  if (!state.monster) {
    spawnMonster();
  } else {
    fightOnce();
  }
}
setInterval(autoBattleLoop, 3000);

/**********************
 * 渲染
 **********************/
function render() {
  document.getElementById("wood").innerText = state.wood;
  document.getElementById("ore").innerText = state.ore;

  document.getElementById("woodcutLv").innerText =
    state.skills.woodcutting.level;
  document.getElementById("miningLv").innerText =
    state.skills.mining.level;

  const stats = getPlayerStats();
  document.getElementById("hp").innerText =
    `${state.player.hp}/${state.player.maxHp}`;
  document.getElementById("atk").innerText = stats.atk;
  document.getElementById("def").innerText = stats.def;

  const list = document.getElementById("equipmentList");
  list.innerHTML = "";
  state.equipment.forEach((e, i) => {
    const li = document.createElement("li");
    li.innerText = `${e.name}（攻${e.atk} 防${e.def}）`;
    li.onclick = () => equipItem(i);
    list.appendChild(li);
  });
}

/**********************
 * 启动
 **********************/
load();
render();
