import plotly.graph_objects as go
import json

# Load the skills data
data = {"skills": [{"skill": "Network Security", "proficiency": 90}, {"skill": "Ethical Hacking", "proficiency": 85}, {"skill": "Python Programming", "proficiency": 80}, {"skill": "IoT Security", "proficiency": 95}, {"skill": "VPN Technologies", "proficiency": 90}, {"skill": "Wireless Networks", "proficiency": 88}, {"skill": "Penetration Testing", "proficiency": 82}, {"skill": "Cloud Security", "proficiency": 75}]}

# Abbreviate skill names to meet 15-character limit
skill_abbreviations = {
    "Network Security": "Net Security",
    "Ethical Hacking": "Ethical Hack",
    "Python Programming": "Python Prog", 
    "IoT Security": "IoT Security",
    "VPN Technologies": "VPN Tech",
    "Wireless Networks": "Wireless Net",
    "Penetration Testing": "Pen Testing",
    "Cloud Security": "Cloud Sec"
}

# Extract data
skills = [skill_abbreviations[item["skill"]] for item in data["skills"]]
proficiency = [item["proficiency"] for item in data["skills"]]

# Close the radar chart by adding the first point at the end
skills_closed = skills + [skills[0]]
proficiency_closed = proficiency + [proficiency[0]]

# Create radar chart
fig = go.Figure()

fig.add_trace(go.Scatterpolar(
    r=proficiency_closed,
    theta=skills_closed,
    fill='toself',
    fillcolor='rgba(31, 184, 205, 0.3)',  # Using brand color #1FB8CD with transparency
    line=dict(color='#1FB8CD', width=2),
    name='Proficiency',
    hovertemplate='<b>%{theta}</b><br>Level: %{r}%<extra></extra>'
))

# Update layout
fig.update_layout(
    polar=dict(
        radialaxis=dict(
            visible=True,
            range=[0, 100],
            ticksuffix='%',
            tickfont=dict(size=10)
        ),
        angularaxis=dict(
            tickfont=dict(size=10)
        )
    ),
    title="Technical Expertise Profile",
    showlegend=False
)

# Save the chart
fig.write_image("technical_skills_radar.png")