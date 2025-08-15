#!/bin/bash
# setup-rss-environment.sh
# Script to set up the RSS environment for testing

echo "=== Setting up Afropop Worldwide RSS Environment ==="
echo

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    echo "   Current directory: $(pwd)"
    exit 1
fi

echo "✅ Verified project directory"
echo

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "📝 Creating .env.local file..."
    cat > .env.local << EOF
# Afropop Worldwide RSS Configuration
# For immediate testing, we'll use direct parsing
RSS_PARSER_SERVICE=direct
AFROPOP_RSS_URL=https://feeds.simplecast.com/EpDu11tq
RSS_CACHE_TIMEOUT=300000

# For production, uncomment and configure these:
# RSS_PARSER_SERVICE=rssapp
# RSS_PARSER_API_KEY=your_api_key_here
EOF
    echo "✅ Created .env.local with default configuration"
else
    echo "✅ .env.local file already exists"
fi

echo

# Check dependencies
echo "📦 Checking dependencies..."
if command -v npm &> /dev/null; then
    echo "✅ npm is available"
    
    # Check if rss-parser is installed
    if npm list rss-parser &> /dev/null; then
        echo "✅ rss-parser is installed"
    else
        echo "🔄 Installing rss-parser..."
        npm install rss-parser
    fi
    
    # Check if feed is installed
    if npm list feed &> /dev/null; then
        echo "✅ feed is installed"
    else
        echo "🔄 Installing feed..."
        npm install feed
    fi
else
    echo "❌ npm is not available. Please install Node.js and npm."
    exit 1
fi

echo

# Verify API routes exist
echo "🔍 Verifying API routes..."
REQUIRED_ROUTES=(
    "app/api/rss/route.ts"
    "app/api/search/route.ts"
    "app/api/episodes/route.ts"
    "app/api/features/route.ts"
    "app/api/item/[id]/route.ts"
    "app/api/rss-proxy/route.ts"
)

ALL_ROUTES_EXIST=true
for route in "${REQUIRED_ROUTES[@]}"; do
    if [ ! -f "$route" ]; then
        echo "❌ Missing API route: $route"
        ALL_ROUTES_EXIST=false
    fi
done

if [ "$ALL_ROUTES_EXIST" = true ]; then
    echo "✅ All API routes are in place"
fi

echo

# Verify core service files exist
echo "🔍 Verifying core service files..."
REQUIRED_SERVICES=(
    "app/lib/rss-service-enhanced.ts"
    "app/lib/use-rss-data.ts"
    "app/lib/rss-utils.ts"
)

ALL_SERVICES_EXIST=true
for service in "${REQUIRED_SERVICES[@]}"; do
    if [ ! -f "$service" ]; then
        echo "❌ Missing service file: $service"
        ALL_SERVICES_EXIST=false
    fi
done

if [ "$ALL_SERVICES_EXIST" = true ]; then
    echo "✅ All core service files are in place"
fi

echo

# Summary
echo "=== Setup Summary ==="
if [ "$ALL_ROUTES_EXIST" = true ] && [ "$ALL_SERVICES_EXIST" = true ]; then
    echo "🎉 RSS environment setup is COMPLETE!"
    echo
    echo "Next steps:"
    echo "1. Start the development server: npm run dev"
    echo "2. Visit http://localhost:3000 to view the site"
    echo "3. Test RSS endpoints:"
    echo "   - http://localhost:3000/api/rss"
    echo "   - http://localhost:3000/api/search?q=test"
    echo "   - http://localhost:3000/api/episodes"
    echo
    echo "For production deployment:"
    echo "1. Sign up for a third-party RSS service (RSS.app recommended)"
    echo "2. Obtain an API key"
    echo "3. Update .env.local with your credentials"
    echo "4. Change RSS_PARSER_SERVICE to your chosen service"
else
    echo "❌ Some required files are missing. Please check the errors above."
fi

echo
echo "For detailed setup instructions, see NEXT_STEPS.md"