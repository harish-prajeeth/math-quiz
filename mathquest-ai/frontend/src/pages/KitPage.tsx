import { useState } from "react";
import { Link } from "react-router-dom";
import { PageScene } from "../components/PageScene";
import { Hud } from "../components/Hud";
import { Panel } from "../components/Panel";
import { GameButton } from "../components/GameButton";
import { Boss } from "../art/Boss";
import { BossBar } from "../components/BossBar";
import { ComboMeter } from "../components/ComboMeter";
import { DifficultyGauge } from "../components/DifficultyGauge";
import { ProgressTrail } from "../components/ProgressTrail";
import { AnswerTile } from "../components/AnswerTile";
import { Chest } from "../components/Chest";
import { Stars } from "../components/Stars";
import { Avatar } from "../art/avatars";
import { useGame } from "../context/GameContext";

export default function KitPage() {
  const { state, update, world } = useGame();
  const [chestOpen, setChestOpen] = useState(false);
  const [bossHits, setBossHits] = useState(0);
  const [bossHp, setBossHp] = useState(70);
  const [combo, setCombo] = useState(3);
  const [selectedTile, setSelectedTile] = useState<number | null>(1);

  return (
    <PageScene>
      <Hud />
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-12">
        {/* World Switcher Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl text-paper">Component Design Kit</h1>
            <p className="text-paper/80 font-medium">
              Ink-sticker arena styling, high contrast, and dynamic game mechanics.
            </p>
          </div>
          <div className="flex gap-2">
            <GameButton
              variant={state.grade === 5 ? "primary" : "secondary"}
              onClick={() => update({ grade: 5 })}
            >
              Jungle Theme (Gr 5)
            </GameButton>
            <GameButton
              variant={state.grade === 6 ? "primary" : "secondary"}
              onClick={() => update({ grade: 6 })}
            >
              Space Theme (Gr 6)
            </GameButton>
          </div>
        </div>

        {/* Boss and Health Section */}
        <section className="space-y-4">
          <h2 className="font-display text-2xl text-paper">Boss & Battle State</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <Panel className="p-6 text-center space-y-4">
              <Boss world={world} hits={bossHits} defeated={bossHp === 0} />
              <BossBar
                name={world === "space" ? "Asteroid Beast" : "Vine Guardian"}
                hp={bossHp}
              />
              <div className="flex justify-center gap-2 pt-2">
                <GameButton
                  variant="secondary"
                  onClick={() => {
                    setBossHits((h) => h + 1);
                    setBossHp((hp) => Math.max(0, hp - 20));
                    setCombo((c) => c + 1);
                  }}
                >
                  Hit Boss ⚔️
                </GameButton>
                <GameButton
                  variant="secondary"
                  onClick={() => {
                    setBossHp(100);
                    setBossHits(0);
                    setCombo(0);
                  }}
                >
                  Reset
                </GameButton>
              </div>
            </Panel>

            <div className="space-y-4">
              <Panel className="p-6 space-y-4">
                <h3 className="font-display text-lg text-ink">Combos & Adaptive Gauge</h3>
                <div className="flex items-center gap-4 flex-wrap">
                  <ComboMeter combo={combo} />
                  <DifficultyGauge difficulty="pro" />
                </div>
                <div className="pt-2">
                  <span className="text-xs font-bold text-ink/70 uppercase">Star Rewards</span>
                  <div className="flex gap-4 mt-2">
                    <Stars count={1} />
                    <Stars count={2} />
                    <Stars count={3} />
                  </div>
                </div>
              </Panel>

              <Panel className="p-6 text-center space-y-4">
                <h3 className="font-display text-lg text-ink">Reward Chest</h3>
                <Chest open={chestOpen} onOpen={() => setChestOpen(!chestOpen)} />
                <GameButton variant="secondary" onClick={() => setChestOpen(!chestOpen)}>
                  {chestOpen ? "Close Chest" : "Open Chest"}
                </GameButton>
              </Panel>
            </div>
          </div>
        </section>

        {/* Trail and Questions */}
        <section className="space-y-4">
          <h2 className="font-display text-2xl text-paper">Progress Trail & Answers</h2>
          <Panel className="p-6 space-y-6">
            <div>
              <h3 className="font-display text-lg text-ink mb-2">Question Progress</h3>
              <ProgressTrail
                total={10}
                current={4}
                results={[true, true, false, true, undefined, undefined, undefined, undefined, undefined, undefined]}
              />
            </div>

            <div className="space-y-3">
              <h3 className="font-display text-lg text-ink">Answer Tiles</h3>
              <div className="grid gap-3">
                <AnswerTile
                  letter="A"
                  text="3/4 of the total volume"
                  state={selectedTile === 0 ? "selected" : "idle"}
                  onClick={() => setSelectedTile(0)}
                />
                <AnswerTile
                  letter="B"
                  text="Direct hit: 12.5 square meters"
                  state="correct"
                  onClick={() => {}}
                />
                <AnswerTile
                  letter="C"
                  text="Not quite: 8.2 units"
                  state="wrong"
                  onClick={() => {}}
                />
                <AnswerTile
                  letter="D"
                  text="Removed by 50/50 powerup"
                  state="removed"
                  onClick={() => {}}
                />
              </div>
            </div>
          </Panel>
        </section>

        {/* Avatars */}
        <section className="space-y-4">
          <h2 className="font-display text-2xl text-paper">Player Avatars</h2>
          <Panel className="p-6">
            <div className="flex gap-4 flex-wrap justify-center">
              {[0, 1, 2, 3, 4, 5].map((id) => (
                <div key={id} className="text-center space-y-1">
                  <div className="p-2 rounded-2xl border-[3px] border-ink bg-white">
                    <Avatar id={id} size={56} />
                  </div>
                  <span className="text-xs font-bold text-ink">#{id + 1}</span>
                </div>
              ))}
            </div>
          </Panel>
        </section>

        <div className="text-center pt-4">
          <Link to="/map" className="tile px-6 py-3 bg-[var(--world-pop)] font-display text-lg inline-block">
            Explore Georgia Standards Trail →
          </Link>
        </div>
      </div>
    </PageScene>
  );
}
