-- ==============================================================================
-- VeritasCraft Migration: Pinterest Studio Upgrades & Gemini AI Studio Persistence
-- Adds background customization fields, multi-size canvas dimensions, and AI outputs storage
-- ==============================================================================

-- 1. Upgrade pinterest_pins with dimensions, background configurations, and export metadata
ALTER TABLE IF EXISTS pinterest_pins
ADD COLUMN IF NOT EXISTS pin_size_preset TEXT DEFAULT 'standard_2_3',
ADD COLUMN IF NOT EXISTS canvas_width INT DEFAULT 1000,
ADD COLUMN IF NOT EXISTS canvas_height INT DEFAULT 1500,
ADD COLUMN IF NOT EXISTS background_type TEXT DEFAULT 'gradient', -- 'solid', 'gradient', 'image_upload', 'image_library', 'image_url', 'video_upload', 'video_library', 'video_url'
ADD COLUMN IF NOT EXISTS background_config JSONB DEFAULT '{
    "color": "#1E3A8A",
    "gradient": {"from": "#1E3A8A", "to": "#0F172A", "direction": "to-br"},
    "imageFit": "cover",
    "zoom": 1.0,
    "position": {"x": 50, "y": 50},
    "brightness": 100,
    "contrast": 100,
    "blur": 0,
    "opacity": 100,
    "overlayColor": "#000000",
    "overlayOpacity": 30,
    "videoFit": "cover",
    "videoMuted": true,
    "videoTrimStart": 0,
    "videoTrimEnd": 15
}'::jsonb,
ADD COLUMN IF NOT EXISTS video_url TEXT,
ADD COLUMN IF NOT EXISTS export_format TEXT DEFAULT 'png',
ADD COLUMN IF NOT EXISTS last_exported_at TIMESTAMPTZ;

-- 2. AI Content Studio outputs table
CREATE TABLE IF NOT EXISTS ai_writing_outputs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    tool_type TEXT NOT NULL, -- 'pin_title', 'pin_description', 'blog_outline', etc.
    topic TEXT NOT NULL,
    generated_content TEXT NOT NULL,
    target_audience TEXT,
    tone TEXT,
    language TEXT DEFAULT 'English',
    metadata JSONB DEFAULT '{}'::jsonb,
    is_saved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS policies for AI outputs
ALTER TABLE ai_writing_outputs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own AI writing outputs"
ON ai_writing_outputs
FOR ALL
USING (auth.uid() = user_id OR auth.uid() IS NULL);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_pinterest_pins_size ON pinterest_pins(pin_size_preset);
CREATE INDEX IF NOT EXISTS idx_ai_writing_outputs_tool ON ai_writing_outputs(tool_type);
