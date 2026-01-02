export const CLUSTERS = ["Cluster 1", "Cluster 2"] as const;

export const NETWORKS = {
    "Cluster 1": {
        "Male": ["Grenadier", "Better You", "Overcomers", "Kingdom Souldiers", "Light-bearers"],
        "Female": ["WOW", "Loved", "Phoenix", "Conquerors", "Pearls", "Dauntless", "Royalties"]
    },
    "Cluster 2": {
        "Male": ["Bravehearts", "Astig", "Transformer", "Invincible", "Generals", "Champs", "Unbreakable multiplier"],
        "Female": ["Exemplary", "Gems", "Diamonds", "Bride", "Fab", "Triumphant", "Visionary"]
    }
} as const;

export const MINISTRIES = [
    "Worship Team",
    "Media",
    "Usher",
    "Marshal",
    "Production",
    "Kid's Church",
    "Technical",
    "PA",
    "Finance",
    "Arete",
    "Hosting",
    "Writer"
] as const;
