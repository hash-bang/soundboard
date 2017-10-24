angular.module('app', ['angular-bs-tooltip'])
	.controller('soundboardCtrl', function($interval, $http, $scope) {

		// Playing items {{{
		$scope.playing = 0;
		$scope.stopAll = ()=> {
			$scope.sounds.forEach(s => {
				if (s.isPlaying) s.play();
			});
		};
		// }}}

		// Data refresher {{{
		$scope.loading = false;
		$scope.sounds;
		$scope.refresh = ()=> {
			$scope.loading = true;
			$http.get('sounds/index.json')
				.then(data => $scope.sounds = data.data.map(a => {
					a.show = true;
					a.audio = new Audio(a.path.replace('.wav', '.mp3'));
					a.play = ()=> {
						if (!a.isPlaying) {
							$scope.playing++;
							a.isPlaying = true;
							a.audio.play();
							a.audioWatch = $interval(()=> {
								if (!a.audio.paused) {
									a.isPlaying = false;
									$scope.playing--;
									$interval.cancel(a.audioWatch);
								}
							}, 100);
						} else {
							a.audio.stop();
							a.isPlaying = false;
							$scope.playing--;
							$interval.cancel(a.audioWatch);
						}
					};
					return a;
				}))
				.finally(()=> $scope.loading =false);
		};
		// }}}

		// Categories {{{
		$scope.showCategories = true;
		$scope.categories;
		$scope.toggleCategories = ()=> $scope.showCategories = !$scope.showCategories;

		$scope.$watch('sounds', ()=> {
			if (!$scope.sounds) return; // Not yet loaded
			$scope.categories = _($scope.sounds)
				.map('tags')
				.flatten()
				.sort()
				.uniq()
				.map(i => ({
					id: i,
					sounds: $scope.sounds.filter(s => s.tags.includes(i)),
				}))
				.value();
		});
		// }}}

		// Filtering / query {{{
		$scope.$watchGroup(['sounds', 'query'], ()=> {
			if (!$scope.sounds) return; // Not yet loaded
			$scope.sounds.forEach(s => s.show = !$scope.query || s.title.toLowerCase().indexOf($scope.query.toLowerCase()) > -1);
		});
		// }}}

		$scope.$evalAsync($scope.refresh);
	})
