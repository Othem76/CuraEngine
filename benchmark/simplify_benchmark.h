// Copyright (c) 2023 UltiMaker
// CuraEngine is released under the terms of the AGPLv3 or higher

#ifndef CURAENGINE_BENCHMARK_SIMPLIFY_BENCHMARK_H
#define CURAENGINE_BENCHMARK_SIMPLIFY_BENCHMARK_H

#include <filesystem>

#include <benchmark/benchmark.h>
#include <fmt/format.h>
#include <grpcpp/create_channel.h>

#include "../tests/ReadTestPolygons.h"
#include "utils/Simplify.h"
#include "plugins/slots.h"

namespace cura
{
class SimplifyTestFixture : public benchmark::Fixture
{
public:
    const std::vector<std::string> POLYGON_FILENAMES = {
        std::filesystem::path(__FILE__).parent_path().append("tests/resources/polygon_concave.txt").string(),  std::filesystem::path(__FILE__).parent_path().append("tests/resources/polygon_concave_hole.txt").string(),
        std::filesystem::path(__FILE__).parent_path().append("tests/resources/polygon_square.txt").string(),   std::filesystem::path(__FILE__).parent_path().append("tests/resources/polygon_square_hole.txt").string(),
        std::filesystem::path(__FILE__).parent_path().append("tests/resources/polygon_triangle.txt").string(), std::filesystem::path(__FILE__).parent_path().append("tests/resources/polygon_two_squares.txt").string(),
        std::filesystem::path(__FILE__).parent_path().append("tests/resources/slice_polygon_1.txt").string(), std::filesystem::path(__FILE__).parent_path().append("tests/resources/slice_polygon_2.txt").string(),
        std::filesystem::path(__FILE__).parent_path().append("tests/resources/slice_polygon_3.txt").string(), std::filesystem::path(__FILE__).parent_path().append("tests/resources/slice_polygon_4.txt").string()
    };

    std::vector<Polygons> shapes;

    void SetUp(const ::benchmark::State& state)
    {
        readTestPolygons(POLYGON_FILENAMES, shapes);
    }

    void TearDown(const ::benchmark::State& state)
    {
    }
};

BENCHMARK_DEFINE_F(SimplifyTestFixture, simplify_local)(benchmark::State& st)
{
    Simplify simplify(MM2INT(0.25), MM2INT(0.025), 50000);
    for (auto _ : st)
    {
        Polygons simplified;
        for (const auto& polys : shapes)
        {
            benchmark::DoNotOptimize(simplified = simplify.polygon(polys));
        }
    }
}

BENCHMARK_REGISTER_F(SimplifyTestFixture, simplify_local);

BENCHMARK_DEFINE_F(SimplifyTestFixture, simplify_slot_noplugin)(benchmark::State& st)
{
    plugins::slot_registry::instance().set(plugins::simplify_t{});
	auto simplify = plugins::slot_registry::instance().get<plugins::SlotID::SIMPLIFY>();
	for (auto _ : st)
	{
        Polygons simplified;
		for (const auto& polys : shapes)
		{
			benchmark::DoNotOptimize(simplified = simplify(polys, MM2INT(0.25), MM2INT(0.025), 50000));
		}
	}
}

BENCHMARK_REGISTER_F(SimplifyTestFixture, simplify_slot_noplugin);

BENCHMARK_DEFINE_F(SimplifyTestFixture, simplify_slot_localplugin)(benchmark::State& st)
{
    auto host = "localhost";
    auto port = 33700;

    try
    {
        slots::instance().connect<plugins::simplify_t>( grpc::CreateChannel(fmt::format("{}:{}", host, port), grpc::InsecureChannelCredentials())));
    }
    catch (std::runtime_error e)
    {
        st.SkipWithError(e.what());
    }
    for (auto _ : st)
    {
        Polygons simplified;
        for (const auto& polys : shapes)
        {
            benchmark::DoNotOptimize(simplified = slots::instance().invoke<plugins::simplify_t>(polys, MM2INT(0.25), MM2INT(0.025), 50000));
        }
    }
}

BENCHMARK_REGISTER_F(SimplifyTestFixture, simplify_slot_localplugin);
} // namespace cura
#endif // CURAENGINE_BENCHMARK_SIMPLIFY_BENCHMARK_H