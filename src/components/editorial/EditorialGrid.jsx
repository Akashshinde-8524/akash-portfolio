import { useState } from "react";
import { usePortfolioData } from "../../context";
import { EditorialCard } from "./EditorialCard";
import "./EditorialGrid.css";

// Renders the six homepage cards from data — dynamic via usePortfolioData.
// Positioning of each card comes from its `gridArea`, matched against the
// areas defined in EditorialGrid.css.
export function EditorialGrid() {
  const { homeCards } = usePortfolioData();
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <div className="editorial-grid">
      {homeCards.map((card) => (
        <EditorialCard
          key={card.id}
          {...card}
          isActive={hoveredId === card.id}
          isDimmed={hoveredId !== null && hoveredId !== card.id}
          onHoverStart={() => setHoveredId(card.id)}
          onHoverEnd={() => setHoveredId(null)}
        />
      ))}
    </div>
  );
}
